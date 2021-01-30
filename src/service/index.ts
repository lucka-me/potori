import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { umi } from './umi';

import AuthKit, { AuthStatusChangedCallback } from './auth';
import BrainstormingKit from './brainstorming';
import FileKit, { DownloadCallback, Filename } from './file';
import Mari, { ProgressCallback } from './mari';
import Nomination from './nomination';
import translations from 'locales';
import Version from './version';

import { BlobGenerator, Parser } from './tools';

type BasicCallback = () => void;
type MessageCallback = (message: string) => void;
type MatchCallback = (target: Nomination, candidate: Nomination, callback: (matched: boolean) => void) => void;

/**
 * Events for {@link Service}
 */
interface ServiceEvents {
    authStatusChanged   : AuthStatusChangedCallback,    // Triggered when authentication status changed
    progressUpdate      : ProgressCallback, // Triggered when progress updated
    bufferUpdate        : ProgressCallback, // Triggered when buffer (secondary progress) updated
    bsUpdate            : BasicCallback,    // Triggered when brainstorming data updated

    start   : BasicCallback,    // Triggered when progress bar should show up
    idle    : BasicCallback,    // Triggered when process is finished
    clear   : BasicCallback,    // Triggered when UI should be cleared

    match   : MatchCallback,    // Triggered when a manually matching required

    alert   : MessageCallback,  // Triggered when alert raised
    info    : MessageCallback,  // Triggered when some information should be passed to user
}

/**
 * Item for manually matching
 */
interface MatchItem {
    target: Nomination,             // The broken nomination, should be rejected and missing image
    candidates: Array<Nomination>,  // Candidates, pending, early than target and with same title
}

/**
 * Handle all non-UI tasks and host data
 */
export namespace service {

    export const auth       = new AuthKit();
    export const bs         = new BrainstormingKit();
    export const file       = new FileKit();
    export const mari       = new Mari();
    export const version    = new Version();

    export const nominations: Array<Nomination> = [];    // Nomination list

    export const errors: Array<ErrorEvent> = [];

    export const events: ServiceEvents = {
        authStatusChanged:  () => { },
        progressUpdate:     () => { },
        bufferUpdate:       () => { },
        bsUpdate:           () => { },
        
        start:  () => { },
        idle:   () => { },
        clear:  () => { },

        match:  () => { },
        
        alert:  () => { },
        info:   () => { },
    };

    export function init() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js');
            });
        }

        i18next
            .use(LanguageDetector)
            .init({
                fallbackLng: 'en-US',
                keySeparator: false,
                resources: translations,
                ns: ['general', 'message'],
                defaultNS: 'general',
            });

        auth.events.authStatusChanged = (signedIn) => {
            if (!signedIn) {
                nominations.length = 0;
            }
            events.authStatusChanged(signedIn);
            if (signedIn) {
                startMail();
            }
        };
        auth.events.error = (error) => {
            events.alert(JSON.stringify(error, null, 2));
        }

        auth.init();

        mari.events.alert = (message) => events.alert(message);
        mari.events.progress = (percent) => events.progressUpdate(percent * 0.9);
        mari.events.buffer = (percent) => events.bufferUpdate(percent);
        mari.events.finish = () => arrange();
        mari.init();

        window.addEventListener('error', (errorEvent) => {
            errors.push(errorEvent);
        })
    }

    /**
     * Start to download data and process mail
     */
    function startMail() {
        events.clear();
        events.start();
        download(() => {
            mari.start(nominations);
        });
    }

    /**
     * Arrange nominations, merge duplicated nominations
     * Next step is {@link sort}
     */
    function arrange() {
        events.start();
        // Collect broken nominations
        const matchQueue: Array<MatchItem> = [];
        // Merge duplicated nominations -> targets
        for (let i = nominations.length - 1; i >= 0; i--) {
            const current = nominations[i];
            if (current.id.length < 1) {
                matchQueue.push({
                    target: current,
                    candidates: []
                });
                nominations.splice(i, 1);
                continue;
            }
            for (let j = 0; j < i; j++) {
                const target = nominations[j];
                if (current.id !== target.id) continue;
                if (target.status === umi.StatusCode.Pending) {
                    target.title = current.title;
                    target.status = current.status;
                    target.reasons = current.reasons;
                    target.resultTime = current.resultTime;
                    target.resultMailId = current.resultMailId;
                    if (current.lngLat) target.lngLat = current.lngLat;
                } else {
                    target.confirmedTime = current.confirmedTime;
                    target.confirmationMailId = current.confirmationMailId;
                    if (!target.lngLat) target.lngLat = current.lngLat;
                }
                nominations.splice(i, 1);
                break;
            }
        }

        const pendings = nominations.filter((nomination) => nomination.status === umi.StatusCode.Pending);

        // Find out candidates
        for (const item of matchQueue) {
            const testScanner = item.target.scanner !== umi.ScannerCode.Unknown;
            for (const nomination of pendings) {
                if (item.target.title !== nomination.title) continue;
                if (item.target.resultTime < nomination.confirmedTime) continue;
                if (
                    testScanner
                    && nomination.scanner !== umi.ScannerCode.Unknown
                    && nomination.scanner !== item.target.scanner
                ) continue;
                item.candidates.push(nomination);
            }
        }

        manuallyMatch(matchQueue);
    }

    /**
     * Match the first target in queue and first candidate in its cadidates
     * Next step is {@link sort}
     * @param queue Queue to match
     */
    function manuallyMatch(queue: Array<MatchItem>) {
        if (queue.length < 1) {
            sort();
            return;
        }
        const item = queue[0];
        if (item.candidates.length < 1) {
            queue.shift();
            manuallyMatch(queue);
            return;
        }
        const candidate = item.candidates[0];
        events.match(item.target, candidate, (matched) => {
            if (matched) {
                candidate.status = item.target.status;
                candidate.resultTime = item.target.resultTime;
                candidate.resultMailId = item.target.resultMailId;
                queue.shift();
                for (const item of queue) {
                    const index = item.candidates.indexOf(candidate);
                    if (index < 0) continue;
                    item.candidates.splice(index, 1);
                }
            } else {
                item.candidates.shift();
            }
            manuallyMatch(queue);
        });
    }

    /**
     * Sort nominations by result time or confirmed time
     * Next step is {@link queryLocation}
     */
    function sort() {
        nominations.sort((a, b) => {
            const timeA = a.resultTime ? a.resultTime : a.confirmedTime;
            const timeB = b.resultTime ? b.resultTime : b.confirmedTime;
            return timeA < timeB ? 1 : -1;
        });

        queryLocation();
    }

    /**
     * Query locations
     * Next step is {@link event.idle}
     */
    function queryLocation() {
        const finished = () => {
            events.idle();
        };

        // Query locations
        const listNoLocation = nominations.reduce((list, nomination) => {
            if (!nomination.lngLat) list.push(nomination);
            return list;
        }, new Array<Nomination>());
        if (listNoLocation.length < 1) {
            finished();
            return;
        }
        let count = 0;
        events.progressUpdate(0.9);
        const countUp = () => {
            count += 1;
            events.progressUpdate(0.9 + (count / listNoLocation.length * 0.1));
            if (count === listNoLocation.length) finished();
        };
        for (const nomination of listNoLocation) {
            bs.queryLocation(
                nomination,
                (lngLat) => {
                    nomination.lngLat = lngLat;
                    countUp();
                },
                countUp
            );
        }
    }

    /**
     * Open local file
     */
    export function open() {
        events.clear();
        const onload = (content: string) => {
            const resultNominations = Parser.nominations(content);
            if (resultNominations.matched) {
                nominations.length = 0;
                nominations.push(...resultNominations.nominations);
                arrange();
                return;
            }
            const resultBsData = Parser.bsData(content);
            if (resultBsData.matched) {
                bs.data = resultBsData.data;
                if (nominations.length > 0) {
                    events.bsUpdate();
                }
                events.info(i18next.t('message:service.loadBsData'));
                return;
            }
            // Parse as other contents
        };
        file.local.open(onload, events.alert);
    }

    /**
     * Save local file
     */
    export function save() {
        if (nominations.length < 1) {
            events.alert(i18next.t('message:service.nominationsEmpty'));
            return;
        }
        file.local.save(Filename.nominations, BlobGenerator.nominations(nominations));
        window.setTimeout(() => {
            file.local.save(Filename.bsData, BlobGenerator.bsData(bs.data));
        }, 2000);
    }

    /**
     * Download data files from Google Drive
     * @param finish Triggered when download finishes
     */
    function download(finish: BasicCallback) {
        let finishedNominations = false;
        let finishedBsData = false;

        const checkFinish = () => {
            if (finishedNominations && finishedBsData) finish();
        };

        file.googleDrive.download(Filename.bsData, (result) => {
            if (!result) {
                finishedBsData = true;
                checkFinish();
                return false;
            }

            try {
                bs.data = new Map(result as Array<[string, any]>);
            } catch (error) {
                return true;
            }

            finishedBsData = true;
            checkFinish();
            return false;
        });

        file.googleDrive.download(Filename.nominations, (file) => {
            if (!file) {
                finishedNominations = true;
                checkFinish();
                return false;
            }
            try {
                const jsonList = file as Array<any>;
                nominations.length = 0;
                for (const json of jsonList) {
                    try {
                        nominations.push(Nomination.parse(json));
                    } catch (error) {
                        // Log or alert
                    }
                }
            } catch (error) {
                return true;
            }

            finishedNominations = true;
            checkFinish();
            return false;
        });
    }

    /**
     * Upload data to Google Drive
     */
    export function upload() {

        let uploadedNominations = false;
        let uploadedBsData = false;

        const checkFinish = () => {
            if (uploadedNominations && uploadedBsData) {
                events.info(i18next.t('message:service.uploaded'));
            };
        };

        file.googleDrive.upload(
            Filename.nominations,
            BlobGenerator.nominations(nominations),
            auth.accessToken,
            (succeed: boolean, message?: string) => {
                uploadedNominations = true;
                if (!succeed) {
                    events.alert(`${i18next.t('message:service.uploadNominationsError')}${message ? `\n${message}` : ''}`);
                }
                checkFinish();
            }
        );

        file.googleDrive.upload(
            Filename.bsData,
            BlobGenerator.bsData(bs.data),
            auth.accessToken,
            (succeed: boolean, message?: string) => {
                uploadedBsData = true;
                if (!succeed) {
                    events.alert(`${i18next.t('message:service.uploadBsDataError')}${message ? `\n${message}` : ''}`);
                }
                checkFinish();
            }
        );

    }

    /**
     * Import JSON from Wayfarer API response
     * @param raw Raw JSON
     */
    export function importJSON(raw: string) {
        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch (error) {
            events.alert(i18next.t('message:service.parseError'));
            return;
        }
        if (!parsed.result || parsed.result.length < 1) {
            events.alert(i18next.t('message:service.invalidData'));
            return;
        }
        const mapNomination = new Map<string, Nomination>();
        
        for (const monination of nominations) {
            mapNomination.set(monination.id, monination);
        }
        let count = 0;
        for (const nomination of parsed.result) {
            const imageUrl = nomination.imageUrl.replace('https://lh3.googleusercontent.com/', '');
            const id = Nomination.parseId(imageUrl);
            if (!mapNomination.has(id)) continue;

            const monination = mapNomination.get(id);
            monination.title = nomination.title;
            monination.lngLat = {
                lng: parseFloat(nomination.lng),
                lat: parseFloat(nomination.lat)
            };
            count += 1;
        }
        events.info(i18next.t('message:service.imported', { count: count }));
        events.idle();
    }

    /**
     * Query Brainstorming firebase and update local bs data
     */
    export function updateBsData() {
        bs.update(nominations, () => {
            events.bsUpdate();
            events.info(i18next.t('message:service.bsDataUpdated'));
        });
    }

    /**
     * Clear Brainstorming database
     */
    export function clearBsData() {
        bs.clear();
    }
}
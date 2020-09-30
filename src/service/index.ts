import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import AuthKit, { AuthStatusChangedCallback } from './auth';
import { BlobGenerator, Parser } from './tools';
import BrainstormingKit from './brainstorming';
import FileKit, { Constants as FileConst } from './file';
import Mari, { ProgressCallback } from './mari';
import Nomination from './nomination';
import StatusKit from './status';
import translations from 'locales';
import Version from './version';

type BasicCallback = () => void;
type MessageCallback = (message: string) => void;

/**
 * Events for {@link Service}
 */
interface ServiceEvents {
    authStatusChanged   : AuthStatusChangedCallback,    // Triggered when authentication status changed
    progressUpdate      : ProgressCallback, // Triggered when progress updated
    updateBs            : BasicCallback,    // Triggered when brainstorming data updated

    start   : BasicCallback,    // Triggered when progress bar should show up
    idle    : BasicCallback,    // Triggered when process is finished
    clear   : BasicCallback,    // Triggered when UI should be cleared

    alert   : MessageCallback,  // Triggered when alert raised
    info    : MessageCallback,  // Triggered when some information should be passed to user
}

/**
 * Handle all non-UI tasks and host data
 */
export namespace service {

    export const auth       = new AuthKit();
    export const bs         = new BrainstormingKit();
    export const file       = new FileKit();
    export const mari       = new Mari();
    export const status     = new StatusKit();
    export const version    = new Version();

    export const nominations: Array<Nomination> = [];    // Nomination list

    export const events: ServiceEvents = {
        authStatusChanged:  () => { },
        progressUpdate:     () => { },
        updateBs:           () => { },
        
        start:  () => { },
        idle:   () => { },
        clear:  () => { },
        
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

        mari.events.finish = () => final();
        mari.init();
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
     * Final process, merge duplicated nominations, sort and query locations
     */
    function final() {
        events.start();
        // Merge duplicated nominations -> targets
        for (let i = nominations.length - 1; i >= 0; i--) {
            const current = nominations[i];

            for (let j = 0; j < i; j++) {
                if (current.id !== nominations[j].id) continue;
                const target = nominations[j];
                if (target.resultMailId) {
                    target.confirmedTime = current.confirmedTime;
                    target.confirmationMailId = current.confirmationMailId;
                    if (!target.lngLat) target.lngLat = current.lngLat;
                } else {
                    target.status = current.status;
                    target.lngLat = current.lngLat;
                    target.resultTime = current.resultTime;
                    target.resultMailId = current.resultMailId;
                }
                nominations.splice(i, 1);
                break;
            }
        }

        // Sort by time
        nominations.sort((a, b) => {
            const timeA = a.resultTime ? a.resultTime : a.confirmedTime;
            const timeB = b.resultTime ? b.resultTime : b.confirmedTime;
            return timeA < timeB ? 1 : -1;
        });

        const finished = () => {
            events.idle();
        };

        // Query locations
        const listNoLocation: Array<Nomination> = nominations.reduce((list, nomination) => {
            if (!nomination.lngLat) list.push(nomination);
            return list;
        }, []);
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
                final();
                return;
            }
            const resultBsData = Parser.bsData(content);
            if (resultBsData.matched) {
                bs.data = resultBsData.data;
                if (nominations.length > 0) {
                    events.updateBs();
                }
                events.info(i18next.t('message:Load as Brainstorming Data'));
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
            events.alert(i18next.t('message:No Nomination to save'));
            return;
        }
        file.local.save(FileConst.nominations, BlobGenerator.nominations(nominations));
        window.setTimeout(() => {
            file.local.save(FileConst.bsData, BlobGenerator.bsData(bs.data));
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

        const gotNominations = (file: gapi.client.drive.File, more: boolean) => {
            if (!file) {
                finishedNominations = true;
                checkFinish();
                return true;
            }
            try {
                const jsonList = file as Array<any>;
                nominations.length = 0;
                nominations.push(...jsonList.map(json => Nomination.from(json)));
            } catch (error) {
                if (more) return false;
                finishedNominations = true;
                checkFinish();
                return true;
            }

            finishedNominations = true;
            checkFinish();
            return true;
        };
        const gotBsData = (result: gapi.client.drive.File, more: boolean) => {
            if (!result) {
                finishedBsData = true;
                checkFinish();
                return true;
            }

            try {
                bs.data = new Map(result as Array<[string, any]>);
            } catch (error) {
                if (more) return false;
                finishedBsData = true;
                checkFinish();
                return true;
            }

            finishedBsData = true;
            checkFinish();
            return true;
        };
        file.googleDrive.download(FileConst.bsData, gotBsData);
        file.googleDrive.download(FileConst.nominations, gotNominations);
    }

    /**
     * Upload data to Google Drive
     */
    export function upload() {

        let uploadedNominations = false;
        let uploadedBsData = false;

        const checkFinish = () => {
            if (uploadedNominations && uploadedBsData) {
                events.info(i18next.t('message:Uploaded'));
            };
        };

        file.googleDrive.upload(
            FileConst.nominations,
            BlobGenerator.nominations(nominations),
            auth.accessToken,
            (succeed: boolean, message?: string) => {
                uploadedNominations = true;
                if (!succeed) {
                    events.alert(`${i18next.t('message:Unable to upload Nomination List')}${message ? `\n${message}` : ''}`);
                }
                checkFinish();
            }
        );

        file.googleDrive.upload(
            FileConst.bsData,
            BlobGenerator.bsData(bs.data),
            auth.accessToken,
            (succeed: boolean, message?: string) => {
                uploadedBsData = true;
                if (!succeed) {
                    events.alert(`${i18next.t('message:Unable to upload Brainstorming Data')}${message ? `\n${message}` : ''}`);
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
            events.alert(i18next.t('message:Unable to parse the code'));
            return;
        }
        if (!parsed.result || parsed.result.length < 1) {
            events.alert(i18next.t('message:Invalid data'));
        }
        const mapNomination = new Map();
        for (const monination of nominations) {
            mapNomination.set(monination.id, monination);
        }
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
        }
        events.idle();
    }

    /**
     * Query Brainstorming firebase and update local bs data
     */
    export function updateBsData() {
        bs.update(nominations, () => {
            events.updateBs();
            events.info(i18next.t('message:Brainstorming Data updated'));
        });
    }

    /**
     * Clear Brainstorming database
     */
    export function clearBsData() {
        bs.clear();
    }
}
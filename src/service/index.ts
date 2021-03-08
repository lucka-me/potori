import { Store } from 'vuex'

import { State } from '@/store';
import GoogleKit from './google';
import Mari from './mari';
import Nomination from './nomination';
import { preferences } from './preferences';

export namespace service {

    type DownloadCallback = (count: number) => void;

    enum Filename {
        nominations = 'nominations.json',
        legacy = 'potori.json'
    }

    const google = new GoogleKit();
    const mari = new Mari();
    let _store: Store<State>;

    export function init(store: Store<State>) {
        _store = store;

        load();

        google.init(() => {
            google.auth.events.authStatusChanged = (authed) => {
                _store.commit('setGAPIAuthed', authed);
                _store.commit('gapiLoaded');
            };
            google.auth.init();

            mari.events.finish = (nominations) => {
                arrange(nominations);
            };
            mari.init();
        });
    }

    export function signIn() {
        google.auth.signIn();
    }

    export function signOut() {
        google.auth.signOut();
    }

    export function refresh() {
        if (preferences.google.sync()) {
            download(Filename.nominations, () => {
                processMails();
            })
        } else {
            processMails();
        }
    }

    export function migrate() {
        download(Filename.legacy, (count) => {
            // Alert count
        });
    }

    function processMails() {
        _store.commit('setStatus', State.Status.processingMails);
        mari.start(_store.state.nominations);
    }

    function arrange(nominations: Array<Nomination>) {
        const matchTarget: Array<Nomination> = [];
        const reduced = nominations.reduce((list, nomination) => {
            if (nomination.id.length < 1) {
                matchTarget.push(nomination);
                return list;
            }
            // Merge
            let merged = false;
            for (const target of list) {
                if (target.merge(nomination)) {
                    merged = true;
                    break;
                }
            }
            if (!merged) {
                list.push(nomination);
            }
            return list;
        }, new Array<Nomination>());
        _store.commit('setNominations', reduced);
        save();
        _store.commit('setStatus', State.Status.idle);
    }

    function download(file: Filename, callback: DownloadCallback) {
        _store.commit('setStatus', State.Status.syncing);
        google.drive.download(file, (file) => {
            if (!file) {
                callback(0);
                return false;
            }
            try {
                const count = importNominations(file as Array<any>);
                callback(count);
            } catch (error) {
                return true;
            }
            return false;
        });
    }

    function importNominations(jsonList: Array<any>): number {
        let count = 0;
        try {
            const sources = jsonList.map(json => Nomination.parse(json));
            const nominations = _store.state.nominations.map((nomination) => nomination);
            for (const nomination of sources) {
                let merged = false;
                for (const target of nominations) {
                    merged = target.merge(nomination);
                    if (merged) {
                        count += 1;
                        break;
                    }
                }
                if (merged) continue;
                nominations.push(nomination);
            }
            _store.commit('setNominations', nominations);
            save();
        } catch (error) {
            count = 0;
        }
        return count;
    }

    function load() {
        const jsonString = localStorage.getItem('potori.nominations');
        if (jsonString) {
            try {
                const jsonList = JSON.parse(jsonString) as Array<any>;
                const nominations = jsonList.map(json => Nomination.parse(json));
                _store.commit('setNominations', nominations);
            } catch (error) {
                
            }
        }
    }

    function save() {
        localStorage.setItem(
            'potori.nominations',
            JSON.stringify(_store.state.nominations.map(nomination => nomination.json))
        );
    }

    /**
     * Match the first target in queue and first candidate in its cadidates
     * Next step is {@link sort}
     * @param queue Queue to match
     */
    /*
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
    */

    /**
     * Query locations
     * Next step is {@link event.idle}
     */
    /*
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
    */

    /**
     * Open local file
     */
    /*
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
    */

    /**
     * Save local file
     */
    /*
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
    */

    /**
     * Upload data to Google Drive
     */
    /*
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
    */

    /**
     * Import JSON from Wayfarer API response
     * @param raw Raw JSON
     */
    /*
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
    */
    
    /**
     * Query Brainstorming firebase and update local bs data
     */
    /*
    export function updateBsData() {
        bs.update(nominations, () => {
            events.bsUpdate();
            events.info(i18next.t('message:service.bsDataUpdated'));
        });
    }
    */

    /**
     * Clear Brainstorming database
     */
    /*
    export function clearBsData() {
        bs.clear();
    }
    */
}
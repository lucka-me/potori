import { Store } from 'vuex'

import { State } from '@/store';
import GoogleKit from './google';
import Mari from './mari';
import Nomination from './nomination';
import { preferences } from './preferences';
import { umi } from './umi';

export namespace service {

    type DownloadCallback = (count: number) => void;
    type UploadCallback = (succeed: boolean, message?: string) => void;

    enum Filename {
        nominations = 'nominations.json',
        legacy = 'potori.json'
    }

    export interface MatchPack {
        target: Nomination;
        candidates: Array<Nomination>;
        selected: string;
    }

    export interface MatchData {
        packs: Array<MatchPack>;
        callback: () => void;
    }

    const mimeJSON = 'application/json';

    const google = new GoogleKit();
    const mari = new Mari();
    let _store: Store<State>;

    export const matchData: MatchData = {
        packs: [],
        callback: () => { }
    };

    export function init(store: Store<State>) {
        _store = store;

        load();

        google.init(() => {
            google.auth.events.authStatusChanged = (authed) => {
                _store.commit('setGAPIAuthed', authed);
                _store.commit('gapiLoaded');
            };
            google.auth.init();

            mari.events.progress = (progress) => {
                setProgress(progress);
            };
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

    export function sync() {
        download(Filename.nominations, () => {
            upload(() => {

            });
        });
    }

    export function upload(callback: UploadCallback) {
        setStatus(State.Status.syncing);
        const blob = getNominationsBlod();
        google.drive.upload(Filename.nominations, mimeJSON, blob, google.auth.accessToken, (succeed, message) => {
            setStatus(State.Status.idle);
            callback(succeed, message);
        });
    }

    export function migrate() {
        download(Filename.legacy, (count) => {
            // Alert count
        });
    }

    export function importNominationsFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'json';
        input.hidden = true;
        input.addEventListener('change', () => {
            setTimeout(() => {
                input.remove();
            }, 1000);
            if (!input.files || input.files.length < 1) return;
            const file = input.files[0];
            const fileReader = new FileReader();
            fileReader.onload = () => {
                if (typeof fileReader.result !== 'string') return;
                try {
                    const jsonList = JSON.parse(fileReader.result) as Array<any>;
                    importNominations(jsonList);
                } catch (error) {

                }
            };
            fileReader.readAsText(file);
        }, false);
        document.body.append(input);
        input.click();
    }

    export function exportNominationsFile() {
        const anchor = document.createElement('a');
        anchor.href = URL.createObjectURL(getNominationsBlod());
        anchor.download = Filename.nominations;
        anchor.hidden = true;
        document.body.append(anchor);
        anchor.click();
        anchor.remove();
    }

    export function clearNominations() {
        _store.commit('setNominations', []);
        save();
    }

    export function save() {
        localStorage.setItem(
            'potori.nominations',
            JSON.stringify(_store.state.nominations.map(nomination => nomination.json))
        );
    }

    function processMails() {
        setProgress(0);
        setStatus(State.Status.processingMails);
        mari.start(_store.state.nominations);
    }

    function arrange(nominations: Array<Nomination>) {
        const matchTargets: Array<Nomination> = [];
        const reduced = nominations.reduce((list, nomination) => {
            if (nomination.id.length < 1) {
                console.log(`service.arrange: Need match: #${nomination.id}[${nomination.title}]`);
                matchTargets.push(nomination);
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
        console.log(`service.arrange: ${nominations.length} reduced to ${reduced.length}`);
        if (matchTargets.length > 0) {
            match(matchTargets, reduced);
        } else {
            if (preferences.google.sync()) {
                upload(() => { finish(reduced); });
            } else {
                finish(reduced);
            }
        }
    }

    /**
     * Some result mails don't contain image URL, should match from pending nominations manually.
     * @param targets Nominations without image
     * @param list Normal nominations
     */
    function match(targets: Array<Nomination>, list: Array<Nomination>) {
        const pendings = list.filter(umi.status.get(umi.StatusCode.Pending)!.predicator);
        const packs: Array<MatchPack> = [];
        for (const target of targets) {
            const checkScanner = target.scanner !== umi.ScannerCode.Unknown;
            const candidates = pendings.filter((nomination) => {
                if (nomination.title !== target.title) return false;
                if (nomination.confirmedTime >= target.resultTime) return false;
                if (checkScanner && nomination.scanner !== umi.ScannerCode.Unknown && nomination.scanner !== nomination.scanner) return false;
                return true;
            });
            if (candidates.length < 1) continue;
            packs.push({ target: target, candidates: candidates, selected: '' });
        }
        if (packs.length < 1) {
            finish(list);
        } else {
            matchData.packs = packs;
            matchData.callback = () => {
                matchData.callback = () => { };
                for (const pack of matchData.packs) {
                    if (pack.selected.length < 1) continue;
                    for (const candidate of pack.candidates) {
                        if (candidate.id !== pack.selected) continue;
                        pack.target.image = candidate.image;
                        pack.target.id = candidate.id;
                        break;
                    }
                    if (pack.target.id.length < 1) continue;
                    for (const nomination of list) {
                        nomination.merge(pack.target);
                    }
                }
                matchData.packs = [];
                finish(list);
            };
            setStatus(State.Status.requestMatch);
        }
    }

    function finish(list: Array<Nomination>) {
        _store.commit('setNominations', list);
        save();
        setStatus(State.Status.idle);
    }

    function setStatus(status: State.Status) {
        _store.commit('setStatus', status);
    }

    function setProgress(progress: number) {
        _store.commit('setProgress', progress);
    }

    function download(file: Filename, callback: DownloadCallback) {
        setStatus(State.Status.syncing);
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

    function getNominationsBlod(): Blob {
        const jsonList = _store.state.nominations.map((nomination) => nomination.json);
        return new Blob(
            [ JSON.stringify(jsonList, null, 4) ],
            { type: mimeJSON }
        )
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
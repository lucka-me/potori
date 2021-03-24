import type { Composer } from 'vue-i18n';
import { Store } from 'vuex'
import { toRaw } from '@vue/reactivity';

import { brainstorming } from './brainstorming';
import { delibird } from './delibird';
import { dia } from './dia';
import { preferences } from './preferences';
import { umi } from './umi';
import { util } from './utils';
import { CountCallback } from './types';
import { State } from '@/store';
import GoogleKit from './google';
import Mari from './mari';
import Nomination, { NominationData } from './nomination';

export namespace service {

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

    export const errors: Array<ErrorEvent> = [];

    export function init(store: Store<State>, i18n: Composer<unknown, unknown, unknown>) {
        _store = store;

        window.addEventListener('error', (errorEvent) => {
            errors.push(errorEvent);
        });

        umi.init(i18n);
        brainstorming.init();

        load();

        google.init(() => {
            google.auth.events.authStatusChanged = (authed) => {
                _store.commit('setGAPIAuthed', authed);
                _store.commit('gapiLoaded');
            };
            google.auth.init();

            mari.events.alert = (message) => {
                delibird.alert(message);
            }
            mari.events.progress = (progress) => {
                setProgress(progress);
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

    export async function refresh() {
        if (preferences.google.sync()) await download(Filename.nominations);
        setProgress(0);
        setStatus(State.Status.processingMails);
        const raws = getRaws()
        await mari.start(raws);
        const matchTargets: Array<Nomination> = [];
        const reduced = raws.reduce((list, nomination) => {
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
        console.log(`service.arrange: ${raws.length} reduced to ${reduced.length}`);
        if (matchTargets.length > 0) {
            await match(matchTargets, reduced);
        }
        if (preferences.brainstorming.autoQueryFirebase()) {
            await queryBrainstorming(reduced);
        }
        if (preferences.google.sync()) {
            await upload();
        }
        _store.commit('setNominations', reduced);
        save();
        setStatus(State.Status.idle);
    }

    export async function updateBrainstorming() {
        setStatus(State.Status.queryingBrainstorming);
        const count = await brainstorming.update(getRaws(), progress => {
            setProgress(progress);
        });
        setStatus(State.Status.idle);
        return count;
    }

    export async function sync() {
        await download(Filename.nominations);
        await upload();
    }

    export async function upload() {
        setStatus(State.Status.syncing);
        const blob = getNominationsBlod();
        await google.drive.upload(Filename.nominations, mimeJSON, blob, google.auth.accessToken);
        setStatus(State.Status.idle);
    }

    export function migrate(callback: CountCallback) {
        download(Filename.legacy).then(count => {
            setStatus(State.Status.idle);
            callback(count);
        })
    }

    export function importNominationsFile(callback: CountCallback) {
        util.importFile().then(content => {
            try {
                const list = JSON.parse(content) as Array<NominationData>;
                const count = importNominations(list);
                callback(count);
            } catch (error) {
                callback(0);
            }
        });
    }

    export function exportNominationsFile() {
        util.exportFile(Filename.nominations, getNominationsBlod());
    }

    /**
     * Import JSON from Wayfarer API response
     * 
     * Error codes
     * - `-1` Parse error
     * - `-2` Invalid data
     * @param json Raw JSON
     * @returns Count of updated nominations or error code
     */
    export function importWayfarerJSON(json: string): number {
        let parsed;
        try {
            parsed = JSON.parse(json);
        } catch (error) {
            // Parse error
            return -1;
        }
        if (!parsed.result || parsed.result.length < 1) {
            // Invalid data
            return -2;
        }

        const nominations = _store.state.nominations;
        const mapNomination = nominations.reduce((map, nomination) => {
            map.set(nomination.id, nomination);
            return map;
        }, new Map<string, Nomination>());
        
        let count = 0;
        for (const data of parsed.result) {
            const id = Nomination.parseId(data.imageUrl);
            const nomination = mapNomination.get(id);
            if (!nomination) continue;
            nomination.title = data.title;
            nomination.lngLat = {
                lng: parseFloat(data.lng),
                lat: parseFloat(data.lat)
            };
            count += 1;
        }
        save();
        return count;
    }

    export function update(nomination: Nomination) {
        dia.save(toRaw(nomination));
    }

    export function clearNominations() {
        dia.clear();
        _store.commit('setNominations', []);
    }

    export function deleteNomination(id: string) {
        dia.remove(id);
        _store.commit('deleteNomination', id);
    }

    export function save() {
        const raws = getRaws();
        dia.saveAll(raws);
    }

    async function load() {
        await dia.init();
        const raws = await dia.load();
        const nominations = raws.map(raw => Nomination.from(raw));
        _store.commit('setNominations', nominations);
    }

    /**
     * Some result mails don't contain image URL, should match from pending nominations manually.
     * @param targets Nominations without image
     * @param list Normal nominations
     */
     async function match(targets: Array<Nomination>, list: Array<Nomination>) {
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
        return new Promise<void>((resolve) => {
            if (packs.length < 1) {
                resolve();
                return;
            }
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
                resolve();
            };
            setStatus(State.Status.requestMatch);
        });
    }

    async function queryBrainstorming(list: Array<Nomination>) {
        setStatus(State.Status.queryingBrainstorming);
        let count = 0;
        for (const nomination of list) {
            count++;
            if (nomination.lngLat) {
                setProgress(count / list.length);
                continue;
            }
            const record = await brainstorming.query(nomination).catch(_ => undefined);
            if (!record) {
                setProgress(count / list.length);
                continue;
            }
            nomination.lngLat = {
                lng: parseFloat(record.lng), lat: parseFloat(record.lat)
            };
            setProgress(count / list.length);
        }
    }

    function setStatus(status: State.Status) {
        _store.commit('setStatus', status);
    }

    function setProgress(progress: number) {
        _store.commit('setProgress', progress);
    }

    async function download(filename: Filename) {
        setStatus(State.Status.syncing);
        const file = await google.drive.download(filename, content => {
            try {
                const list = content as Array<NominationData>;
                list.forEach(data => Nomination.from(data));
            } catch {
                return false;
            }
            return true;
        });
        if (!file) return 0;
        return importNominations(file as Array<NominationData>);
    }

    function importNominations(list: Array<NominationData>): number {
        let count = 0;
        try {
            const sources = list.map(data => Nomination.from(data));
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

    function getRaws(): Array<Nomination> {
        return _store.state.nominations.map(nomination => toRaw(nomination));
    }

    function getNominationsBlod(): Blob {
        const raws = _store.state.nominations.map((nomination) => toRaw(nomination.data));
        return new Blob(
            [ JSON.stringify(raws, null, 4) ],
            { type: mimeJSON }
        )
    }
    
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
}
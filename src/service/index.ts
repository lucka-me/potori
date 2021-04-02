import type { VueI18n } from 'vue-i18n';
import { Store } from 'vuex'
import { toRaw } from '@vue/reactivity';

import type { State } from '@/store/state';
import { brainstorming } from './brainstorming';
import { delibird } from './delibird';
import { dia } from './dia';
import { preferences } from './preferences';
import { umi } from './umi';
import { util } from './utils';
import { CountCallback } from './types';
import GoogleKit from './google';
import Mari from './mari';
import Nomination, { NominationData, NominationJSON } from './nomination';

export enum ServiceStatus {
    idle,
    processingMails,
    requestMatch,
    queryingBrainstorming,
    syncing
}

export namespace service {

    export import Status = ServiceStatus;

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

    export function init(store: Store<State>, i18n: VueI18n<unknown, unknown, unknown>) {
        _store = store;

        window.addEventListener('error', (errorEvent) => {
            errors.push(errorEvent);
        });

        dia.init(_store);
        brainstorming.init();
        umi.init(i18n);

        google.init(() => {
            google.auth.events.authStatusChanged = (authed) => {
                _store.commit('google/setAuthed', authed);
                _store.commit('google/loaded');
            };
            google.auth.init();

            mari.events.alert = (message) => {
                delibird.alert(message);
            }
            mari.events.progress = (progress, max) => {
                setProgress(progress, max);
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
        setProgress(0, 0);
        setStatus(Status.processingMails);
        const raws = await dia.getAll()
        await mari.start(raws);
        const matchTargets: Array<Nomination> = [];
        const reduced = raws.reduce((list, raw) => {
            if (raw.id.length < 1) {
                console.log(`service.arrange: Need match: #${raw.id}[${raw.title}]`);
                matchTargets.push(Nomination.from(raw));
                return list;
            }
            // Merge
            let merged = false;

            for (const target of list) {
                if (target.merge(raw)) {
                    merged = true;
                    break;
                }
            }
            if (!merged) {
                list.push(Nomination.from(raw));
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
        await dia.saveAll(reduced);
        setStatus(Status.idle);
    }

    export async function updateBrainstorming() {
        setProgress(0, 0);
        setStatus(Status.queryingBrainstorming);
        const count = await brainstorming.update(await dia.getAll(), (progress, max) => {
            setProgress(progress, max);
        });
        setStatus(Status.idle);
        return count;
    }

    export async function sync() {
        await download(Filename.nominations);
        await upload();
    }

    export async function upload() {
        setStatus(Status.syncing);
        const blob = await getNominationsJSONBlod();
        await google.drive.upload(Filename.nominations, mimeJSON, blob, google.auth.accessToken);
        setStatus(Status.idle);
    }

    export function migrate(callback: CountCallback) {
        download(Filename.legacy).then(count => {
            setStatus(Status.idle);
            callback(count);
        })
    }

    export async function importNominationsFile(): Promise<number> {
        const content = await util.importFile();
        try {
            const list = JSON.parse(content) as Array<NominationData>;
            const count = await importNominations(list);
            return count;
        } catch (error) {
            return 0;
        }
    }

    export async function exportNominationsFile() {
        const blob = await getNominationsJSONBlod();
        util.exportFile(Filename.nominations, blob);
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
    export async function importWayfarerJSON(json: string): Promise<number> {
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

        const nominations = await dia.getAll();
        const mapNomination = nominations.reduce((map, nomination) => {
            map.set(nomination.id, nomination);
            return map;
        }, new Map<string, NominationData>());
        
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
        await dia.saveAll(nominations);
        return count;
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
            setStatus(Status.requestMatch);
        });
    }

    async function queryBrainstorming(list: Array<Nomination>) {
        setStatus(Status.queryingBrainstorming);
        let count = 0;
        for (const nomination of list) {
            count++;
            if (nomination.lngLat) {
                setProgress(count, list.length);
                continue;
            }
            const record = await brainstorming.query(nomination).catch(_ => undefined);
            if (!record) {
                setProgress(count, list.length);
                continue;
            }
            nomination.lngLat = {
                lng: parseFloat(record.lng), lat: parseFloat(record.lat)
            };
            setProgress(count, list.length);
        }
    }

    function setStatus(status: Status) {
        _store.commit('service/setStatus', status);
    }

    function setProgress(progress: number, max: number) {
        _store.commit('progress/setMax', max);
        _store.commit('progress/setProgress', progress);
    }

    async function download(filename: Filename) {
        setStatus(Status.syncing);
        const file = await google.drive.download(filename, content => {
            try {
                const list = content as Array<NominationJSON>;
                list.forEach(data => Nomination.from(data));
            } catch {
                return false;
            }
            return true;
        });
        if (!file) return 0;
        return await importNominations(file as Array<NominationJSON>);
    }

    async function importNominations(list: Array<NominationJSON>): Promise<number> {
        let count = 0;
        try {
            const sources = list.map(data => Nomination.from(data));
            const raws = await dia.getAll();
            const nominations = raws.map(raw => Nomination.from(raw));
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
            await dia.saveAll(nominations.map(nomination => nomination.data));
        } catch (error) {
            count = 0;
        }
        return count;
    }

    async function getNominationsJSONBlod(): Promise<Blob> {
        const raws = await dia.getAll();
        const jsons = raws.map(raws => Nomination.from(raws).json);
        return new Blob(
            [ JSON.stringify(jsons, null, 4) ],
            { type: mimeJSON }
        )
    }
}
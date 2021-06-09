import { umi } from '@/service/umi';
import { util } from '@/service/utils';
import { ProgressCallback } from '@/service/types';
import Nomination, { NominationRAW } from '@/service/nomination';

/**
 * Host Brainstorming data and handle tasks related to Brainstorming
 */
export namespace brainstorming {

    const mimeJSON = 'application/json';
    const filename = 'bsdata.json';

    export enum FailReason {
        INDEXEDDB_ERROR = 'INDEXEDDB_ERROR',    // Unable to query local database
        FIREBASE_ERROR  = 'FIREBASE_ERROR',     // Unable to query firebase
        NOT_EXISTS      = 'NOT_EXISTS',         // Nomination not exists in local database or firebase
        EARLY           = 'EARLY',              // Nomination got result before firebase exists
    };

    export interface ReviewRaw {
        cultural: string;
        description: string;
        location: string;
        quality: string;
        safety: string;
        uniqueness: string;
    }

    export interface Review {
        JSON: ReviewRaw;
        Timestamp: number;
        author: string;
        reasons: string;
        stars: string;
    }

    export interface Record {
        description: string;
        hashTags: Array<string>;
        imageUrl: string;
        lastTime: number;
        lat: string;
        lng: string;
        statement?: string;
        streetAddress: string;
        supportingImageUrl?: string;
        title: string;
        [name: string]: any | Review;
    }

    const databaseName = 'brainstorming';
    const databaseVersion = 1;
    const storeName = 'record';

    let database: IDBDatabase | undefined = undefined;  // Local database

    export async function init() {
        return new Promise<boolean>((resolve, reject) => {
            const request = window.indexedDB.open(databaseName, databaseVersion);
            request.onsuccess = () => {
                database = request.result;
                resolve(true);
            };
            request.onerror = () => reject(request.error);
            request.onupgradeneeded = () => {
                request.result.createObjectStore(storeName);
            };
        });
    }

    /**
     * Query data from local databse and firebase (full version only)
     * @param nomination Nomination to query
     * @param succeed Triggered when succeed to query data
     * @param failed Triggered when Failed to query data
     */
    export async function query(nomination: NominationRAW): Promise<Record> {
        if (beforeCreate(nomination)) {
            throw new Error(FailReason.EARLY);
        }
        let record = await queryDatabase(nomination.id).catch(error => { throw error; });
        if (record) return record;
        record = await queryFirebase(nomination.id).catch(error => { throw error; });
        if (!record) throw new Error(FailReason.NOT_EXISTS);
        return record;
    }

    /**
     * Query firebase to update local database
     * @param nominations Nomination list
     * @param finish Triggered when all query finishes
     */
    export async function update(nominations: Array<NominationRAW>, callback: ProgressCallback): Promise<number> {
        let succeed = 0;
        let processed = 0;
        const total = nominations.length;
        const queries: Array<Promise<void>> = [];
        for (const nomination of nominations) {
            if (beforeCreate(nomination)) {
                processed++;
                callback(processed, total);
                continue;
            }
            const query = queryFirebase(nomination.id)
                .then(record => { if (record) succeed++; })
                .catch()
                .finally(() => {
                    processed++;
                    callback(processed, total);
                })
            queries.push(query);
        }
        await Promise.allSettled(queries);
        return succeed;
    }

    export async function getFromLocal(nomination: NominationRAW) {
        if (beforeCreate(nomination)) return undefined;
        return await queryDatabase(nomination.id);
    }

    export async function contains(nomination: NominationRAW) {
        if (beforeCreate(nomination)) return false;
        const record = await queryDatabase(nomination.id);
        return typeof record !== 'undefined';
    }

    export async function importDatabase() {
        const content = await util.importFile();
        let data: Map<string, Record>;
        try {
            data = new Map(JSON.parse(content));
        } catch (error) {
            return 0;
        }
        for (const [key, record] of data) save(key, record);
        return data.size;
    }

    export async function exportDatabase(): Promise<number> {
        const list = await getAll();
        if (list.length < 1) return 0;
        const pairs: Array<[string, Record]> = list.map(record => [ Nomination.parseId(record.imageUrl), record]);
        const blob = new Blob(
            [ JSON.stringify(pairs, null, 4) ],
            { type: mimeJSON }
        );
        util.exportFile(filename, blob);
        return pairs.length;
    }

    /**
     * Clear local database
     */
    export function clear() {
        const store = getStore('readwrite');
        if (!store) return;
        store.clear();
    }

    /**
     * Check if the nomination got result before creation of firebase, should skip query if true
     * @param nomination The nomination
     */
    export function beforeCreate(nomination: NominationRAW): boolean {
        return nomination.status !== umi.StatusCode.Pending && nomination.resultTime < 1518796800000;
    }

    /**
     * Query from the local IndexedDB database
     * @param id Brainstorming ID
     */
    async function queryDatabase(id: string): Promise<Record | undefined> {
        const store = getStore('readonly');
        if (!store) throw new Error(FailReason.INDEXEDDB_ERROR);
        return await settled(store.get(id));
    }

    /**
     * Query from the Firebase database
     * @param id Brainstorming ID
     */
    async function queryFirebase(id: string): Promise<Record | undefined> {
        let record: Record | undefined = undefined;
        try {
            const response = await fetch(`https://oprbrainstorming.firebaseio.com/c/reviews/${id}.json`);
            record = await response.json();
        } catch {
            throw new Error(FailReason.FIREBASE_ERROR);
        }
        return record;
    }

    async function getAll(): Promise<Array<Record>> {
        const store = getStore('readonly');
        if (!store) return [];
        return await settled(store.getAll()) ?? [];
    }

    async function save(id: string, record: Record) {
        const store = getStore('readwrite');
        if (!store) return;
        await settled(store.put(record, id));
    }

    function getStore(mode: IDBTransactionMode): IDBObjectStore | undefined {
        if (!database) return undefined;
        return database.transaction([ storeName ], mode).objectStore(storeName);
    }

    function settled<T>(request: IDBRequest<T>) {
        return new Promise<T | undefined>((resolve) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => resolve(undefined);
        });
    }
}
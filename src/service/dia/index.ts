import { Store } from 'vuex';
import { State } from '@/store/state';

import { NominationData, Predicator } from '@/service/nomination';

export namespace dia {

    const databaseName = 'potori';
    const databaseVersion = 1;
    const storeName = 'nomination';

    let _store: Store<State>;
    let database: IDBDatabase | undefined = undefined;

    export function init(store: Store<State>) {
        _store = store;
        const request = window.indexedDB.open(databaseName, databaseVersion);
        return new Promise<boolean>((resolve, reject) => {
            request.onsuccess = () => {
                database = request.result;
                _store.commit('dia/saved');
                resolve(true);
            };
            request.onerror = () => reject(request.error);
            request.onupgradeneeded = () => {
                request.result.createObjectStore(storeName, {
                    keyPath: 'id', autoIncrement: false
                });
            };
        });
    }

    export async function count(predicator?: Predicator): Promise<number> {
        const store = getStore('readonly');
        if (!store) return 0;
        if (!predicator) return await settled(store.count()) ?? 0;
        const list = await settled(store.getAll());
        if (!list) return 0;
        return list.filter(predicator).length;
    }

    export async function get(id: string): Promise<NominationData | undefined> {
        const store = getStore('readonly');
        if (!store) return;
        return await settled(store.get(id));
    }

    export async function getAll(predicator?: Predicator): Promise<Array<NominationData>> {
        const store = getStore('readonly');
        if (!store) return [];
        let list = await settled(store.getAll()) ?? [];
        if (predicator) list = list.filter(predicator);
        return list;
    }

    export async function save(nomination: NominationData) {
        const store = getStore('readwrite');
        if (!store) return;
        const result = await settled(store.put(nomination));
        if (typeof result !== 'undefined') saved();
    }

    export async function saveAll(nominations: Array<NominationData>) {
        await Promise.allSettled(nominations.map(nomination => save(nomination)));
        saved();
    }

    export async function remove(id: string) {
        const store = getStore('readwrite');
        if (!store) return;
        await settled(store.delete(id));
        saved();
    }

    export async function clear() {
        const store = getStore('readwrite');
        if (!store) return;
        await settled(store.clear());
        saved();
    }

    function getStore(mode: IDBTransactionMode): IDBObjectStore | undefined {
        if (!database) return;
        return database.transaction([ storeName ], mode).objectStore(storeName);
    }

    function settled<T>(request: IDBRequest<T>) {
        return new Promise<T | undefined>((resolve) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => resolve(undefined);
        });
    }

    function saved() {
        _store.commit('dia/saved');
    }
}
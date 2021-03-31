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

    export function count(predicator?: Predicator) {
        return new Promise<number>((resolve, _) => {
            const store = getStore('readonly');
            if (!store) {
                resolve(0);
                return;
            }
            const request = store.getAll();
            request.onsuccess = () => {
                let result = request.result as Array<NominationData>;
                if (predicator) result = result.filter(predicator);
                resolve(result.length);
            }
            request.onerror = () => resolve(0);
        });
    }

    export function get(id: string) {
        return new Promise<NominationData | undefined>((resolve, _) => {
            const store = getStore('readonly');
            if (!store) {
                resolve(undefined);
                return;
            }
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => resolve(undefined);
        });
    }

    export function getAll(predicator?: Predicator) {
        return new Promise<Array<NominationData>>((resolve, _) => {
            const store = getStore('readonly');
            if (!store) {
                resolve([]);
                return;
            }
            const request = store.getAll();
            request.onsuccess = () => {
                let result = request.result as Array<NominationData>;
                if (predicator) result = result.filter(predicator);
                resolve(result);
            }
            request.onerror = () => resolve([]);
        });
    }

    export function saveAll(nominations: Array<NominationData>) {
        const store = getStore('readwrite');
        if (!store) return;
        for (const nomination of nominations) {
            store.put(nomination);
        }
        saved();
    }

    export function save(nomination: NominationData) {
        const store = getStore('readwrite');
        if (!store) return;
        store.put(nomination);
        saved();
    }

    export function remove(id: string) {
        const store = getStore('readwrite');
        if (!store) return;
        store.delete(id);
        saved();
    }

    export function clear() {
        const store = getStore('readwrite');
        if (!store) return;
        store.clear();
        saved();
    }

    function getStore(mode: IDBTransactionMode): IDBObjectStore | undefined {
        if (!database) return undefined;
        return database.transaction([ storeName ], mode).objectStore(storeName);
    }

    function saved() {
        _store.commit('dia/saved');
    }
}
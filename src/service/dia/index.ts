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
            if (predicator) {
                const request = store.getAll();
                request.onsuccess = () => {
                    let result = request.result as Array<NominationData>;
                    if (predicator) result = result.filter(predicator);
                    resolve(result.length);
                }
                request.onerror = () => resolve(0);
            } else {
                const request = store.count();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => resolve(0);
            }
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

    export async function save(nomination: NominationData) {
        return new Promise<void>(resolve => {
            const store = getStore('readwrite');
            if (!store) {
                resolve();
                return;
            }
            const request = store.put(nomination);
            request.onsuccess = () => {
                saved();
                resolve();
            }
            request.onerror = () => resolve;
        });
    }

    export async function saveAll(nominations: Array<NominationData>) {
        await Promise.allSettled(nominations.map(nomination => save(nomination)));
        saved();
    }

    export async function remove(id: string) {
        return new Promise<void>(resolve => {
            const store = getStore('readwrite');
            if (!store) {
                resolve();
                return;
            }
            const request = store.delete(id);
            request.onsuccess = () => {
                saved();
                resolve();
            };
            request.onerror = () => resolve();
        });
    }

    export async function clear() {
        return new Promise<void>(resolve => {
            const store = getStore('readwrite');
            if (!store) {
                resolve();
                return;
            }
            const request = store.clear();
            request.onsuccess = () => {
                saved();
                resolve();
            };
            request.onerror = () => resolve();
        });
    }

    function getStore(mode: IDBTransactionMode): IDBObjectStore | undefined {
        if (!database) return undefined;
        return database.transaction([ storeName ], mode).objectStore(storeName);
    }

    function saved() {
        _store.commit('dia/saved');
    }
}
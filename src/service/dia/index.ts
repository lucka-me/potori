import Nomination, { NominationData } from '@/service/nomination';

export namespace dia {

    const databaseName = 'potori';
    const databaseVersion = 1;
    const storeName = 'nomination';

    let database: IDBDatabase | undefined = undefined;

    export function init() {
        return new Promise<boolean>((resolve, reject) => {
            const request = window.indexedDB.open(databaseName, databaseVersion);
            request.onsuccess = () => {
                database = request.result;
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

    export function load() {
        return new Promise<Array<NominationData>>((resolve, reject) => {
            const store = getStore('readonly');
            if (!store) {
                reject();
                return;
            }
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    export function saveAll(nominations: Array<Nomination>) {
        const store = getStore('readwrite');
        if (!store) return;
        for (const nomination of nominations) {
            store.put(nomination);
        }
    }

    export function save(nomination: Nomination) {
        const store = getStore('readwrite');
        if (!store) return;
        store.put(nomination);
    }

    export function remove(id: string) {
        const store = getStore('readwrite');
        if (!store) return;
        store.delete(id);
    }

    export function clear() {
        const store = getStore('readwrite');
        if (!store) return;
        store.clear();
    }

    function getStore(mode: IDBTransactionMode): IDBObjectStore | undefined {
        if (!database) return undefined;
        return database.transaction([ storeName ], mode).objectStore(storeName);
    }
}
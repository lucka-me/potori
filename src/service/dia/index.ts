import Nomination, { NominationData } from '@/service/nomination';

export namespace dia {

    const DatabaseVersion = 1;

    let database: IDBDatabase | undefined = undefined;

    export async function init() {
        return new Promise<boolean>((resolve, reject) => {
            const request = window.indexedDB.open('potori', DatabaseVersion);
            request.onsuccess = () => {
                database = request.result;
                resolve(true);
            };
            request.onerror = () => reject(request.error);
            request.onupgradeneeded = () => {
                request.result.createObjectStore('nomination', {
                    keyPath: 'id', autoIncrement: false
                });
            };
        });
    }

    export async function load() {
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
        return database.transaction([ 'nomination' ], mode).objectStore('nomination');
    }
}
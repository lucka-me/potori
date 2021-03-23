import type { Reference } from '@firebase/database-types';

import { umi } from '@/service/umi';
import Nomination from '@/service/nomination'

/**
 * Result for {@link BrainstormingKit.analyse}
 */
interface BrainstormingStats {
    review: number,                     // Review count
    nomination: number,                 // Count of nominations containing reviews
    rate: Map<string, Array<number>>,   // Map of rate lists
    reviewTimes: Array<number>,         // List of review timestamps
    synch: {
        total: number,  // Count of reviews of resulted nominations
        synched: number // Count of reviews matches the result
    },
}

/**
 * Host Brainstorming data and handle tasks related to Brainstorming
 */
export namespace brainstorming {

    export enum FailReason {
        INDEXEDDB_ERROR = 'message:service.brainstorming.indexedDBError',   // Unable to query local database
        FIREBASE_ERROR  = 'message:service.brainstorming.firebaseError',    // Unable to query firebase
        NOT_EXISTS      = 'message:service.brainstorming.notExists',        // Nomination not exists in local database or firebase
        EARLY           = 'message:service.brainstorming.early',            // Nomination got result before firebase exists
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
    let reference: Reference | undefined = undefined;   // Firebase reference

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
    export async function query(nomination: Nomination): Promise<Record> {
        if (beforeCreate(nomination)) {
            throw new Error(FailReason.EARLY);
        }
        let record = await queryDatabase(nomination.id).catch(error => {
            throw error;
        });
        if (record) {
            return record;
        }
        record = await queryFirebase(nomination.id).catch(error => {
            throw error;
        });
        if (!record) throw new Error(FailReason.NOT_EXISTS);
        return record;
    }

    /**
     * Query firebase to update local database
     * @param nominations Nomination list
     * @param finish Triggered when all query finishes
     */
    export async function update(nominations: Array<Nomination>): Promise<number> {
        const quries: Array<Promise<Record | undefined>> = [];
        for (const nomination of nominations) {
            if (beforeCreate(nomination)) continue;
            quries.push(queryFirebase(nomination.id));
        }
        const results = await Promise.allSettled(quries);
        return results.reduce((count, result) => {
            return count + result.status === 'fulfilled' ? 1 : 0;
        }, 0);
    }

    export function getAll() {
        return new Promise<Array<Record>>((resolve) => {
            const store = getStore('readonly');
            if (!store) {
                resolve([]);
                return;
            }
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => resolve([]);
        });
    }

    export async function importDatabase() {

    }

    export async function exportDatabase() {

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
     * Query from the local IndexedDB database
     * @param id Brainstorming ID
     */
    function queryDatabase(id: string) {
        return new Promise<Record | undefined>((resolve, reject) => {
            const store = getStore('readonly');
            if (!store) {
                reject(FailReason.INDEXEDDB_ERROR);
                return;
            }
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => resolve(undefined);
        });
    }

    /**
     * Query from the Firebase database
     * @param id Brainstorming ID
     */
    async function queryFirebase(id: string): Promise<Record | undefined> {
        const [ firebase, _ ] = await Promise.all([
            import(/* webpackChunkName: 'firebase' */ '@firebase/app'),
            import(/* webpackChunkName: 'firebase' */ '@firebase/database'),
        ]).catch(_ => {
            throw new Error(FailReason.FIREBASE_ERROR);
        });
        if (!reference) {
            const app = firebase.default.initializeApp({ databaseURL: 'https://oprbrainstorming.firebaseio.com' });
            if (!reference) reference = app.database!().ref('c/reviews/');
        }
        const data = await reference.child(id).once('value').catch(_ => {
            throw new Error(FailReason.FIREBASE_ERROR);
        });
        const record: Record | undefined = data.val();
        if (record) save(id, record);
        return record;
    }

    function save(id: string, record: Record) {
        const store = getStore('readwrite');
        if (!store) return;
        store.put(record, id);
    }

    /**
     * Check if the nomination got result before creation of firebase, should skip query if true
     * @param nomination The nomination
     */
    function beforeCreate(nomination: Nomination): boolean {
        return nomination.status !== umi.StatusCode.Pending && nomination.resultTime < 1518796800000;
    }

    function getStore(mode: IDBTransactionMode): IDBObjectStore | undefined {
        if (!database) return undefined;
        return database.transaction([ storeName ], mode).objectStore(storeName);
    }

    /**
     * Analyse reviews of given nominations
     * @param nominations Nomination list
     */
    /*
    analyse(nominations: Array<Nomination>): BrainstormingStats {
        const stats: BrainstormingStats = {
            review: 0,
            nomination: 0,
            rate: new Map(),
            reviewTimes: [],
            synch: { total: 0, synched: 0 },
        };
        const rateKeys = Object.keys(RateItems);
        for (const key of rateKeys) {
            stats.rate.set(key, []);
        }
        const statsRate = (rateJson: any, key: string) => {
            if (rateJson[key]) {
                stats.rate.get(key).push(parseInt(rateJson[key]));
            }
        }
        for (const nomination of nominations) {
            if (!this.data.has(nomination.id)) continue;
            const bs = this.data.get(nomination.id);
            const generals = [];
            for (const key of Object.keys(bs)) {
                if (!key.startsWith('review')) continue;
                const review = bs[key];
                if (!review.stars) continue;
                stats.review += 1;
                generals.push(review.stars);
                const rateJson = review.JSON;
                for (const rateKey of rateKeys) {
                    statsRate(rateJson, rateKey);
                }
                stats.reviewTimes.push(review.Timestamp);
                if (nomination.status === umi.StatusCode.Pending) continue;
                // Synch
                stats.synch.total += 1;
                if (this.isSynched(review.stars, nomination)) {
                    stats.synch.synched += 1;
                }
            }
            if (generals.length < 1) continue;
            stats.nomination += 1;
        }
        return stats;
    }
    */

    /**
     * Detect if a review matches the result
     * 
     * - D matches duplicated
     * - 3 or 3+ stars matches accepted and tooClose
     * - 3- stars matches rejected
     * 
     * @param stars Stars of the review
     * @param status Status code of the resulted nomination
     */
    /*
    private isSynched(stars: string, nomination: Nomination) {
        if (
            stars === 'D'
            && nomination.status === umi.StatusCode.Rejected
            && nomination.reasons.includes(umi.Reason.duplicated)
        ) {
            return true;
        }
        const general = parseFloat(stars);
        if (isNaN(general)) return false;
        
        if (
            nomination.status === umi.StatusCode.Accepted
            || (nomination.status === umi.StatusCode.Rejected && nomination.reasons.includes(umi.Reason.close))
        ) {
            // Accepted
            if (general >= 3) return true;
        } else {
            // Rejected
            if (general < 3) return true;
        }
        
        return false;
    }*/
}
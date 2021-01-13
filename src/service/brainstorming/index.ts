import type { Reference } from '@firebase/database-types';

import { service } from 'service';
import { umi } from 'service/umi';
import Nomination, { LngLat } from 'service/nomination'

import { QueryFailReason, RateItems } from './constants';

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

type FailCallback = (reason: QueryFailReason) => void;
type QueryCallback = (data: any) => void;
type QueryLocationCallback = (lngLat: LngLat) => void;
type UpdateCallback = () => void;

/**
 * Host Brainstorming data and handle tasks related to Brainstorming
 */
class BrainstormingKit {

    data: Map<string, any> = new Map();     // Local database
    private reference: Reference = null;    // Firebase reference

    /**
     * Query data from local databse and firebase (full version only)
     * @param nomination Nomination to query
     * @param succeed Triggered when succeed to query data
     * @param failed Triggered when Failed to query data
     */
    query(nomination: Nomination, succeed: QueryCallback, failed: FailCallback) {
        if (this.beforeCreate(nomination)) {
            failed(QueryFailReason.EARLY);
            return;
        }
        if (this.data.has(nomination.id)) {
            succeed(this.data.get(nomination.id));
            return;
        }
        if (!service.version.full) {
            failed(QueryFailReason.NOT_EXISTS);
            return;
        }
        this.queryFirebase(nomination, succeed, failed);
    }

    /**
     * Query location data from local databse and firebase (full version only)
     * @param nomination Nomination to query
     * @param succeed Triggered when succeed to query location
     * @param failed Triggered when Failed to query location
     */
    queryLocation(nomination: Nomination, succeed: QueryLocationCallback, failed: FailCallback) {
        this.query(nomination, (data) => {
            succeed({ lng: parseFloat(data.lng), lat: parseFloat(data.lat) });
        }, failed);
    }

    /**
     * Query firebase to update local database
     * @param nominations Nomination list
     * @param finish Triggered when all query finishes
     */
    update(nominations: Array<Nomination>, finish: UpdateCallback) {
        const queryList = [];
        for (const nomination of nominations) {
            if (this.beforeCreate(nomination)) continue;
            queryList.push(nomination);
        }
        let left = queryList.length;
        const queried = () => {
            left--;
            if (left < 1) finish();
        }
        for (const nomination of queryList) {
            this.queryFirebase(nomination, (value) => {
                this.data.set(nomination.id, value);
                queried();
            }, queried);
        }
    }

    /**
     * Query the firebase
     * @param bsId Brainstorming ID
     * @param succeed Triggered when succeed
     * @param failed Triggered when failed
     */
    private queryFirebase(nomination: Nomination, succeed: QueryCallback, failed: FailCallback) {
        if (this.beforeCreate(nomination)) {
            failed(QueryFailReason.EARLY);
            return;
        }
        Promise.all([
            import(/* webpackChunkName: 'modules-async' */ '@firebase/app'),
            import(/* webpackChunkName: 'modules-async' */ '@firebase/database'),
        ]).then(([ firebase, _ ]) => {
            if (!this.reference) {
                const app = firebase.default.initializeApp({ databaseURL: 'https://oprbrainstorming.firebaseio.com' });
                if (!this.reference) this.reference = app.database().ref('c/reviews/');
            }
            this.reference.child(nomination.id).once('value', (data) => {
                const value = data.val();
                if (!value) {
                    failed(QueryFailReason.NOT_EXISTS);
                    return;
                }
                succeed(value);
            }, () => failed(QueryFailReason.FIREBASE_ERROR));
        });
    }

    /**
     * Clear local database
     */
    clear() {
        this.data.clear();
    }

    /**
     * Check if the nomination got result before creation of firebase, should skip query if true
     * @param nomination The nomination
     */
    beforeCreate(nomination: Nomination): boolean {
        return nomination.status !== umi.StatusCode.Pending && nomination.resultTime < 1518796800000;
    }

    /**
     * Analyse reviews of given nominations
     * @param nominations Nomination list
     */
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
                if (this.isSynched(review.stars, nomination.status)) {
                    stats.synch.synched += 1;
                }
            }
            if (generals.length < 1) continue;
            stats.nomination += 1;
        }
        return stats;
    }

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
    private isSynched(stars: string, status: number) {
        const reasons = umi.reasons;
        if (stars === 'D' && status === umi.StatusReason.duplicated) {
            return true;
        }
        const general = parseFloat(stars);
        if (isNaN(general)) return false;
        const types = umi.types;
        if (status === types.get('accepted').code || status === umi.StatusReason.close) {
            // Accepted
            if (general >= 3) return true;
        } else {
            // Rejected
            if (general < 3) return true;
        }
        
        return false;
    }
}

export default BrainstormingKit;
export { BrainstormingStats, QueryFailReason, RateItems };
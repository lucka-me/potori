import type { Reference } from '@firebase/database-types';

import type Version from "../version";

import Nomination, { LngLat } from '../nomination';
import { RateItems } from "./constants";
import statusKit from '../status';

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

type FailCallback = () => void;
type QueryCallback = (data: any) => void;
type QueryLocationCallback = (lngLat: LngLat) => void;
type UpdateCallback = () => void;

/**
 * Host Brainstorming data and handle tasks related to Brainstorming
 */
class BrainstormingKit {

    data: Map<string, any> = new Map();     // Local database
    private full: boolean = false;          // If current instance is a full version
    private reference: Reference = null;    // Firebase reference

    /**
     * Initiate Brainstorming Kit
     * @param version Instance of {@link Version}
     * @param status Instance of {@link StatusKit}
     */
    init(version: Version) {
        this.full = version.full;
    }

    /**
     * Query data from local databse and firebase (full version only)
     * @param bsId Brainstorming ID
     * @param succeed Triggered when succeed to query data
     * @param failed Triggered when Failed to query data
     */
    query(bsId: string, succeed: QueryCallback, failed: FailCallback) {
        if (this.data.has(bsId)) {
            succeed(this.data.get(bsId));
            return;
        }
        if (!this.full) {
            failed();
            return;
        }
        this.queryFirebase(bsId, succeed, failed);
    }

    /**
     * Query location data from local databse and firebase (full version only)
     * @param bsId Brainstorming ID
     * @param succeed Triggered when succeed to query location
     * @param failed Triggered when Failed to query location
     */
    queryLocation(bsId: string, succeed: QueryLocationCallback, failed: FailCallback) {
        this.query(bsId, (data) => {
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
            if ((nomination.status.code < 1) || !this.data.has(nomination.id)) {
                queryList.push(nomination.id);
            }
        }
        let left = queryList.length;
        const queried = () => {
            left--;
            if (left < 1) finish();
        }
        for (const id of queryList) {
            this.queryFirebase(id, (value) => {
                this.data.set(id, value);
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
    private queryFirebase(bsId: string, succeed: (data: any) => void, failed: () => void) {
        Promise.all([
            import(/* webpackChunkName: 'firebase' */ '@firebase/app'),
            import(/* webpackChunkName: 'firebase' */ '@firebase/database'),
        ]).then(([ firebase, _ ]) => {
            if (!this.reference) {
                const app = firebase.default.initializeApp({ databaseURL: 'https://oprbrainstorming.firebaseio.com' });
                if (!this.reference) this.reference = app.database().ref('c/reviews/');
            }
            this.reference.child(bsId).once('value', (data) => {
                const value = data.val();
                if (!value) {
                    failed();
                    return;
                }
                succeed(value);
            }, failed);
        });
    }

    /**
     * Clear local database
     */
    clear() {
        this.data.clear();
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
                if (nomination.status.code < 1) continue;
                // Synch
                stats.synch.total += 1;
                if (BrainstormingKit.isSynched(review.stars, nomination.status.code)) {
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
    private static isSynched(stars: string, status: number) {
        const reasons = statusKit.reasons;
        if (stars === 'D' && status === reasons.get('duplicated').code) {
            return true;
        }
        const general = parseFloat(stars);
        if (isNaN(general)) return false;
        const types = statusKit.types;
        if (status === types.get('accepted').code || status === reasons.get('tooClose').code) {
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
export { RateItems, BrainstormingStats };
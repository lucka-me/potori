import type { Reference } from "@firebase/database-types";

import Nomination, { LngLat } from "./Nomination";
import statusKit from "./status";
import version from "./version";

const RateItems = {
    quality: 'Quality',
    description: 'Description',
    cultural: 'Cultural',
    uniqueness: 'Uniqueness',
    safety: 'Safety',
    location: 'Location',
};

interface BrainstormingStats {
    review: number,
    nomination: number,
    rate: Map<string, Array<number>>,
    reviewTimes: Array<number>,
    synch: {
        total: number, synched: number
    },
}

class BrainstormingKit {

    data: Map<string, any> = new Map();
    private reference: Reference = null;

    query(bsId: string, succeed: (data: any) => void, failed: () => void) {
        if (this.data.has(bsId)) {
            succeed(this.data.get(bsId));
            return;
        }
        if (!version.full) {
            failed();
            return;
        }
        this.queryFirebase(bsId, succeed, failed);
    }

    queryLngLat(bsId: string, succeed: (lngLat: LngLat) => void, failed: () => void) {
        this.query(bsId, (data) => {
            succeed({ lng: parseFloat(data.lng), lat: parseFloat(data.lat) });
        }, failed);
    }

    update(nominations: Array<Nomination>, finished: () => void) {
        const queryList = [];
        for (const nomination of nominations) {
            if ((nomination.status.code < 1) || !this.data.has(nomination.id)) {
                queryList.push(nomination.id);
            }
        }
        let left = queryList.length;
        const queried = () => {
            left--;
            if (left < 1) finished();
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

    clear() {
        this.data.clear();
    }

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

    static isSynched(stars: string, status: number) {
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
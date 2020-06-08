import Version from "./Version";
import StatusKit from "./StatusKit";

class BrainstormingKit {
    constructor() {
        this.reference = null;
        this.data = new Map();
    }

    init() {
        firebase.initializeApp({ databaseURL: 'https://oprbrainstorming.firebaseio.com' });
        this.reference = firebase.database().ref('c/reviews/');
    }

    query(bsId, onSuccess, onFailed) {
        if (this.data.has(bsId)) {
            onSuccess(this.data.get(bsId));
            return;
        }
        if (!Version.fullFeature) {
            onFailed();
            return;
        }
        this.reference.child(bsId).once(
            'value',
            (data) => {
                const val = data.val();
                if (!val) {
                    onFailed();
                    return;
                }
                this.data.set(bsId, val);
                onSuccess(val);
            },
            (_) => onFailed(),
        );
    }

    queryLngLat(bsId, onSuccess, onFailed) {
        this.query(bsId, (data) => {
            onSuccess({ lng: parseFloat(data.lng), lat: parseFloat(data.lat) });
        }, onFailed);
    }

    update(portals, finished) {
        const queryList = [];
        for (const portal of portals) {
            if ((portal.status < 1) || !this.data.has(portal.status)) {
                queryList.push(portal.id);
            }
        }
        let left = queryList.length;
        const onQueried = () => {
            left--;
            if (left < 1) finished();
        }
        for (const id of queryList) {
            this.reference.child(id).once(
                'value',
                (data) => {
                    const val = data.val();
                    if (!val) {
                        onQueried();
                        return;
                    }
                    this.data.set(id, val);
                    onQueried();
                },
                (_) => onQueried(),
            );
        }
    }

    analyse(portals) {
        const stats = {
            review: 0, portal: 0,
            rate: { },
            reviewTimes: [],
            synch: { total: 0, synched: 0 },
        };
        const rateKeys = Object.keys(BrainstormingKit.rateKeys);
        for (const key of rateKeys) {
            stats.rate[key] = [];
        }
        const statsRate = (rateJson, key) => {
            if (rateJson[key]) {
                stats.rate[key].push(parseInt(rateJson[key]));
            }
        }
        for (const portal of portals) {
            if (!this.data.has(portal.id)) continue;
            const bs = this.data.get(portal.id);
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
                if (portal.status === StatusKit.types.get('pending').code) continue;
                // Synch
                stats.synch.total += 1;
                if (BrainstormingKit.isSynched(review.stars, portal.status)) {
                    stats.synch.synched += 1;
                }
            }
            if (generals.length < 1) continue;
            stats.portal += 1;
        }
        return stats;
    }

    static getId(imgUrl) {
        return imgUrl.replace(/[^a-zA-Z0-9]/g, '').slice(- 10).toLowerCase();
    }

    static get rateKeys() {
        return {
            quality: 'Quality',
            description: 'Description',
            cultural: 'Cultural',
            uniqueness: 'Uniqueness',
            safety: 'Safety',
            location: 'Location',
        };
    }

    static isSynched(stars, status) {
        const reasons = StatusKit.reasons;
        if (stars === 'D' && status === reasons.get('duplicated').code) {
            return true;
        }
        const general = parseFloat(stars);
        if (isNaN(general)) return false;
        const types = StatusKit.types;
        if (general < 3 && status === reasons.get('undeclared').code) {
            return true;
        }
        if (general > 3 && status === types.get('accepted').code) {
            return true;
        }
        if (general > 3 && status === reasons.get('tooClose').code) {
            return true;
        }
        return false;
    }
}

export default BrainstormingKit;
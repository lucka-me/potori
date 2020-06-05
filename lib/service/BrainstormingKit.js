class BrainstormingKit {
    constructor() {
        this.reference = null;
        this.data = new Map();
    }

    init() {
        firebase.initializeApp({ databaseURL: value.string.path.bsDatabase });
        this.reference = firebase.database().ref(value.string.path.bsReference);
    }

    query(bsId, onSuccess, onFailed) {
        if (this.data.has(bsId)) {
            onSuccess(this.data.get(bsId));
            return;
        }
        if (!versionKit.fullFeature) {
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
        const rateKeys = Object.keys(value.string.bs.rate);
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
                if (portal.status === value.data.type.pending.code) continue;
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

    static isSynched(stars, status) {
        const reason = value.data.reason;
        if (stars === 'D' && status === reason.duplicated.code) {
            return true;
        }
        const general = parseFloat(stars);
        if (isNaN(general)) return false;
        const type = value.data.type;
        if (general < 3 && status === reason.undeclared.code) {
            return true;
        }
        if (general > 3 && status === type.accepted.code) {
            return true;
        }
        if (general > 3 && status === reason.tooClose.code) {
            return true;
        }
        return false;
    }
}

export { BrainstormingKit };
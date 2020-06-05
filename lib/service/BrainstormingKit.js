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

    update(onFinished) {
        const queryList = [];
        for (const portal of process.portals) {
            if ((portal.status < 1) || !this.data.has(portal.status)) {
                queryList.push(portal.id);
            }
        }
        let left = queryList.length;
        const onQueried = () => {
            left--;
            if (left < 1) onFinished();
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
const bsKit = {
    reference: null,
    data: new Map(),
    init: () => firebase.initializeApp({ databaseURL: value.string.path.bsDatabase }),
    query: (bsId, onSuccess, onFailed) => {
        if (bsKit.data.has(bsId)) {
            onSuccess(bsKit.data.get(bsId));
            return;
        }
        if (!versionKit.fullFeature) {
            onFailed();
            return;
        }
        bsKit.reference.child(bsId).once(
            'value',
            (data) => {
                const val = data.val();
                if (!val) {
                    onFailed();
                    return;
                }
                bsKit.data.set(bsId, val);
                onSuccess(val);
            },
            (_) => onFailed(),
        );
    },
    queryLngLat: (bsId, onSuccess, onFailed) => {
        bsKit.query(bsId, (data) => {
            onSuccess({ lng: parseFloat(data.lng), lat: parseFloat(data.lat) });
        }, onFailed);
    },
    update: (onFinished) => {
        const queryList = [];
        for (const portal of process.portals) {
            if ((portal.status < 1) || !bsKit.data.has(portal.status)) {
                queryList.push(portal.id);
            }
        }
        let left = queryList.length;
        const onQueried = () => {
            left--;
            if (left < 1) onFinished();
        }
        for (const id of queryList) {
            bsKit.reference.child(id).once(
                'value',
                (data) => {
                    const val = data.val();
                    if (!val) {
                        onQueried();
                        return;
                    }
                    bsKit.data.set(id, val);
                    onQueried();
                },
                (_) => onQueried(),
            );
        }
    },

    loadReference: () => bsKit.reference = firebase.database().ref(value.string.path.bsReference),
    getId: (imgUrl) => imgUrl.replace(/[^a-zA-Z0-9]/g, '').slice(- 10).toLowerCase(),
};
const bsKit = {
    reference: null,
    data: new Map(),
    init: () => firebase.initializeApp({ databaseURL: value.string.path.bsDatabase }),
    loadReference: () => bsKit.reference = firebase.database().ref(value.string.path.bsReference),
    getId: (imgUrl) => imgUrl.replace(/[^a-zA-Z0-9]/g, '').slice(- 10).toLowerCase(),
    queryLngLat: (bsId, onSuccess, onFailed) => {
        if (bsKit.data.has(bsId)) {
            const data = bsKit.data.get(bsId);
            onSuccess({ lng: parseFloat(data.lng), lat: parseFloat(data.lat) });
            return;
        }
        if (!versionKit.fullFeature) {
            onFailed();
            return;
        }
        bsKit.reference.child(bsId).once(
            'value',
            (data) => {
                const value = data.val();
                if (!value) {
                    onFailed();
                    return;
                }
                bsKit.data.set(bsId, value);
                onSuccess({ lng: parseFloat(value.lng), lat: parseFloat(value.lat) });
            },
            (_) => onFailed(),
        );
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
                    const value = data.val();
                    if (!value) {
                        onQueried();
                        return;
                    }
                    bsKit.data.set(id, value);
                    onQueried();
                },
                (_) => onQueried(),
            );
        }
    },
};
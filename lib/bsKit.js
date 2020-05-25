const bsKit = {
    reference: null,
    init: () => firebase.initializeApp({ databaseURL: value.string.path.bsDatabase }),
    loadReference: () => bsKit.reference = firebase.database().ref(value.string.path.bsReference),
    queryLngLat: (bsId, onSuccess, onFailed) => {
        bsKit.reference.child(bsId).once(
            "value",
            (data) => {
                const value = data.val();
                if (!value) {
                    onFailed();
                    return;
                }
                onSuccess({ lng: parseFloat(value.lng), lat: parseFloat(value.lat) });
            },
            (_) => onFailed(),
        );
    },
};
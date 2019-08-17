const firebaseKit = {
    reference: null,
    init: () => firebase.initializeApp({ databaseURL: value.string.path.bsDatabase }),
    loadReference: () => firebaseKit.reference = firebase.database().ref(value.string.path.bsReference),
    queryLngLat: (bsId, onSuccess, onFailed) => {
        firebaseKit.reference.child(bsId).once(
            "value",
            (data) => {
                const value = data.val();
                if (value == null) {
                    onFailed();
                    return;
                }
                onSuccess({ lng: parseFloat(value.lng), lat: parseFloat(value.lat) });
            },
            (_) => onFailed()
        );
    },
};
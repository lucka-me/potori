const process = {
    portals: [],
    finish: () => {
        // Merge duplicated portals -> targetPortals
        for (let i = process.portals.length - 1; i >= 0; i--) {
            const portal = process.portals[i];

            for (let j = 0; j < i; j++) {
                if (portal.id !== process.portals[j].id) continue;
                const targetPortal = process.portals[j];
                if (targetPortal.resultMailId) {
                    targetPortal.confirmedTime = portal.confirmedTime;
                    targetPortal.confirmationMailId = portal.confirmationMailId;
                    if (!targetPortal.lngLat) targetPortal.lngLat = portal.lngLat;
                } else {
                    targetPortal.status = portal.status;
                    targetPortal.lngLat = portal.lngLat;
                    targetPortal.resultTime = portal.resultTime;
                    targetPortal.resultMailId = portal.resultMailId;
                }
                process.portals.splice(i, 1);
                break;
            }
        }

        // Sort by time
        process.portals.sort((a, b) => {
            const timeA = a.resultTime ? a.resultTime : a.confirmedTime;
            const timeB = b.resultTime ? b.resultTime : b.confirmedTime;
            return timeA < timeB ? 1 : -1;
        });

        const onFinished = () => {
            ui.display();
        };

        if (!versionKit.fullFeature) {
            onFinished();
            return;
        }

        // Query locations
        const listNoLocation = [];
        for (const portal of process.portals) {
            if (!portal.lngLat) {
                listNoLocation.push(portal);
            }
        }

        if (listNoLocation.length < 1) {
            onFinished();
            return;
        }
        let count = 0;
        ui.progressBar.progress = 0;
        const countUp = () => {
            count += 1;
            ui.progressBar.progress = count / listNoLocation.length;
            if (count === listNoLocation.length) onFinished();
        };
        for (const portal of listNoLocation) {
            bsKit.queryLngLat(
                portal.id,
                (lngLat) => {
                    portal.lngLat = lngLat;
                    countUp();
                },
                countUp
            );
        }
    },
    import: (raw) => {
        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch (error) {
            dialogKit.alert.show(value.string.alert.invalidData);
            return;
        }
        if (!parsed.result || parsed.result.length < 1) {
            dialogKit.alert.show(value.string.alert.invalidData);
        }
        const mapPortal = new Map();
        for (const portal of process.portals) {
            mapPortal.set(portal.id, portal);
        }
        for (const nomination of parsed.result) {
            const imageUrl = nomination.imageUrl.replace('https://lh3.googleusercontent.com/', '');
            const id = toolkit.getBsId(imageUrl);
            if (!mapPortal.has(id)) continue;

            const portal = mapPortal.get(id);
            portal.title = nomination.title;
            portal.lngLat = {
                lng: parseFloat(nomination.lng),
                lat: parseFloat(nomination.lat)
            };
        }
        ui.display();
    },
};
const ui = {
    dark: {
        enabled : false,
        onMediaQueryChanged: (mediaQueryList) => {
            ui.dark.enabled = mediaQueryList.matches;
            const style = mediaQueryList.matches ? value.string.mapbox.style.dark : value.string.mapbox.style.default;
            if (ui.mainMap.ctrl) ui.mainMap.ctrl.setStyle(style);
            if (dialogKit.details.map.ctrl) dialogKit.details.map.ctrl.setStyle(style);
        },
    },
    appBar: {
        button: {
            status:   null,
            openFile: null, saveFile: null, uploadFile: null,
            auth:     null, signout:  null,
        },
        event: {
            status:     (_) => dialogKit.status.ctrl.open(),
            openFile:   (_) => fileKit.local.openFile(),
            saveFile:   (_) => fileKit.local.saveFile(),
            uploadFile: (_) => fileKit.googleDrive.uploadFile(),
            auth:       (_) => { },
            signout:    (_) => { },
        },
        init: () => {
            const appBarActionDiv = document.querySelector('.mdc-top-app-bar__section--align-end');
            for (const key of Object.keys(ui.appBar.button)) {
                const buttonElement = document.createElement('button');
                buttonElement.className = 'mdc-icon-button material-icons';
                buttonElement.title = value.string.appBar[key].title;
                buttonElement.innerHTML = value.string.appBar[key].icon;
                appBarActionDiv.appendChild(buttonElement);
                ui.appBar.button[key] = new mdc.ripple.MDCRipple(buttonElement);
                ui.appBar.button[key].unbounded = true;
                ui.appBar.button[key].listen('click', ui.appBar.event[key]);
                buttonElement.hidden = true;
            }
            ui.appBar.button.status.root_.hidden = false;
        },
    },
    progressBar: new mdc.linearProgress.MDCLinearProgress(document.querySelector('#progressBar')),
    mainMap: {
        ctrl: null,
        load: () => {
            mapboxgl.accessToken = value.string.mapbox.accessToken;
            ui.mainMap.ctrl = new mapboxgl.Map({ 
                container: 'map-main',
                style: ui.dark.enabled ? value.string.mapbox.style.dark : value.string.mapbox.style.default
            });
            ui.mainMap.ctrl.once('load', () => ui.mainMap.ctrl.resize());
            ui.mainMap.ctrl.addControl(new mapboxgl.NavigationControl());
            ui.mainMap.ctrl.addControl(new mapboxgl.FullscreenControl());
        },
        generateGeoJSON: (portals) => {
            const geoJson = { type: 'FeatureCollection', features: [], };
            for (const portal of portals) {
                if (!portal.lngLat) continue;
                geoJson.features.push({
                    type: 'Feature',
                    properties: {
                        id: portal.id,
                        title: portal.title,
                        type: toolkit.getTypeByCode(portal.status)
                    },
                    geometry: {
                        type: 'Point',
                        'coordinates': [portal.lngLat.lng, portal.lngLat.lat]
                    }
                });
            }
            return geoJson;
        },
        updateSource: (id, type, data) => {
            const source = ui.mainMap.ctrl.getSource(id);
            if (source) {
                source.setData(data);
            } else {
                ui.mainMap.ctrl.addSource(id, {
                    type: 'geojson',
                    data: data,
                    cluster: true,
                });
                const style = getComputedStyle(document.documentElement);
                const color = style.getPropertyValue(`--color-${type}`);
                const colorDark = style.getPropertyValue(`--color-${type}--dark`);
                ui.mainMap.ctrl.addLayer({
                    id: `${id}-cluster`,
                    type: 'circle',
                    source: id,
                    filter: ['has', 'point_count'],
                    paint: {
                        'circle-color': color,
                        'circle-stroke-width': 4,
                        'circle-stroke-color': colorDark,
                        'circle-radius': [
                            'step', ['get', 'point_count'],
                            20, 50,
                            30, 100,
                            40
                        ]
                    }
                });
                ui.mainMap.ctrl.addLayer({
                    id: `${id}-count`,
                    type: 'symbol',
                    source: id,
                    filter: ['has', 'point_count'],
                    layout: {
                        'text-field': '{point_count_abbreviated}',
                        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                        'text-size': 12,
                    },
                    paint: {
                        'text-color': '#FFF',
                    }
                });
                ui.mainMap.ctrl.addLayer({
                    id: `${id}-unclustered`,
                    type: 'circle',
                    source: id,
                    filter: ['!', ['has', 'point_count']],
                    paint: {
                        'circle-color': color,
                        'circle-radius': 5,
                        'circle-stroke-width': 2,
                        'circle-stroke-color': colorDark
                    }
                });

                ui.mainMap.ctrl.on('click', `${id}-cluster`, event => {
                    const features = ui.mainMap.ctrl.queryRenderedFeatures(
                        event.point, { layers: [`${id}-cluster`] }
                    );
                    const clusterId = features[0].properties.cluster_id;
                    ui.mainMap.ctrl.getSource(id).getClusterExpansionZoom(
                        clusterId,
                        (err, zoom) => {
                            if (err) return;
                            ui.mainMap.ctrl.easeTo({ center: features[0].geometry.coordinates, zoom: zoom});
                        }
                    );
                });

                ui.mainMap.ctrl.on('click', `${id}-unclustered`, event => {
                    const coordinates = event.features[0].geometry.coordinates.slice();
                    while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
                    }
                     
                    new mapboxgl.Popup()
                        .setLngLat(coordinates)
                        .setText(event.features[0].properties.title)
                        .addTo(ui.mainMap.ctrl);
                    ui.cardList.scrollTo(
                        0,
                        document.getElementById(`card-${event.features[0].properties.id}`).offsetTop - ui.cardList.offsetTop - 8);
                });
            }
        },
        updateData: () => {
            ui.mainMap.updateSource(
                'potori-pending', 'pending',
                ui.mainMap.generateGeoJSON(dialogKit.status.filter.type.pending.portals)
            );
            ui.mainMap.updateSource(
                'potori-accepted', 'accepted',
                ui.mainMap.generateGeoJSON(dialogKit.status.filter.type.accepted.portals)
            );
            for (const key of Object.keys(dialogKit.status.filter.rejectedReason)) {
                ui.mainMap.updateSource(
                    `potori-rejected-${key}`, 'rejected',
                    ui.mainMap.generateGeoJSON(dialogKit.status.filter.rejectedReason[key].portals)
                );
            }
        },
    },
    cardList: document.getElementById('cardList'),
    init: () => {
        fetch(value.string.github.releaseUrl)
            .then(response => response.json())
            .then(response => {
                document.getElementById('dialogStatusVersion').innerHTML = `${response.name}d${value.data.version}-${versionKit.code}`;
            });
        const darkMediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
        darkMediaQueryList.addListener(ui.dark.onMediaQueryChanged);
        ui.dark.onMediaQueryChanged(darkMediaQueryList);

        ui.appBar.init();
        dialogKit.status.init();

        dialogKit.details.ctrl.listen('MDCDialog:opened', dialogKit.details.onOpened);
        dialogKit.details.ctrl.listen('MDCDialog:closed', dialogKit.details.onClosed);
    },
    refresh: () => {
        ui.appBar.button.openFile.root_.hidden = false;
        ui.appBar.button.saveFile.root_.hidden = true;
        for (const key of Object.keys(dialogKit.status.block)) dialogKit.status.block[key].hidden = true;
        ui.cardList.innerHTML = '';
        ui.mainMap.updateData();
        ui.progressBar.root_.hidden = true;
        ui.progressBar.buffer = 0;
        ui.progressBar.progress = 0;
    },
    fillLocation: (portal, card) => {
        const locationElement = card.querySelector('#button-card-location');
        if (portal.lngLat) {
            locationElement.hidden = false;
            const locationRipple = new mdc.ripple.MDCRipple(locationElement);
            locationRipple.unbounded = true;
            locationRipple.root_.onclick = () => {
                ui.mainMap.ctrl.easeTo({ center: portal.lngLat, zoom: 16 })
            };
        } else {
            locationElement.hidden = true;
        }

        if (versionKit.fullFeature) {
            const intelElement = card.querySelector('#button-card-intel');
            if (portal.lngLat) {
                intelElement.hidden = false;
                const intelRipple = new mdc.ripple.MDCRipple(intelElement);
                intelRipple.unbounded = true;
                intelRipple.root_.onclick = () => window.open(toolkit.lngLatToIntel(portal.lngLat), '_blank', 'noopener');
            } else {
                intelElement.hidden = true;
            }
        }
    },
    fillCard: (portal, card) => {
        if (portal.status > 0) {
            card.querySelector('#cardInterval').innerHTML = toolkit.getIntervalString(portal.confirmedTime, portal.resultTime);
            card.querySelector('#cardResultBox').hidden = false;
            card.querySelector('#cardResultTime').innerHTML = toolkit.getDateString(portal.resultTime);
        } else {
            card.querySelector('#cardInterval').innerHTML = toolkit.getIntervalString(portal.confirmedTime, Date.now());
            card.querySelector('#cardResultBox').hidden = true;
        }

        const matchedData = toolkit.matchData(portal.status);
        const type = toolkit.getTypeByCode(portal.status);
        card.querySelector('#cardResultIcon').innerHTML = value.data.type[type].icon;
        card.querySelector('#cardStatusButton').className = `mdc-button mdc-card__action mdc-card__action--button status-${type}`;
        card.querySelector('#cardStatusButtonIcon').innerHTML = matchedData.icon;
        card.querySelector('#cardStatusButtonLabel').innerHTML = matchedData.title;
    },
    display: () => {
        
        const noLatLngList = [];
        const boundsNE = { lng: -181.0, lat: -91.0 };
        const boundsSW = { lng:  181.0, lat:  91.0 };

        const extendBounds = (lngLat) => {
            if (lngLat.lng > boundsNE.lng) boundsNE.lng = lngLat.lng;
            else if (lngLat.lng < boundsSW.lng) boundsSW.lng = lngLat.lng;
            if (lngLat.lat > boundsNE.lat) boundsNE.lat = lngLat.lat;
            else if (lngLat.lat < boundsSW.lat) boundsSW.lat = lngLat.lat;
        };

        for (const block of Object.keys(dialogKit.status.filter)) {
            for (const key of Object.keys(dialogKit.status.filter[block])) {
                dialogKit.status.filter[block][key].portals = [];
            }
        }

        // Create cards, extend bounds and classify
        for (const portal of process.portalList) {
            const card = document.getElementById('template-card').content.cloneNode(true);

            card.querySelector('.mdc-card').id = `card-${portal.id}`;

            const mainAction = new mdc.ripple.MDCRipple(card.querySelector('.mdc-card__primary-action'));
            mainAction.listen('click', () => dialogKit.details.show(portal));

            card.querySelector('img').src = value.string.path.image + portal.image;
            card.querySelector('#cardTitle').innerHTML = portal.title;
            card.querySelector('#cardConfirmedTime').innerHTML = toolkit.getDateString(portal.confirmedTime);
            ui.fillCard(portal, card);
            dialogKit.status.filter.type[toolkit.getTypeByCode(portal.status)].portals.push(portal);
            if (portal.status > 100) {
                dialogKit.status.filter.rejectedReason[toolkit.getRejectedReasonByCode(portal.status)].portals.push(portal);
            }

            const statusRipple = new mdc.ripple.MDCRipple(card.querySelector('#cardStatusButton'));
            statusRipple.unbounded = true;
            if (versionKit.fullFeature) {
                statusRipple.listen('click', () => window.open(value.string.path.bsWatermeter + portal.id, '_blank', 'noopener'));
            } else {
                statusRipple.listen('click', () => {
                    const textarea = document.createElement('textarea');
                    textarea.value = portal.id;
                    textarea.readOnly = true;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    dialogKit.alert.show(`Brainstorming ID copied: ${portal.id}`);
                });
            }
            if (portal.lngLat) {
                extendBounds(portal.lngLat);
                ui.fillLocation(portal, card);
            } else {
                noLatLngList.push(portal);
            }
            ui.cardList.appendChild(card);
        }

        if (noLatLngList.length < process.portalList.length) {
            ui.mainMap.ctrl.fitBounds([boundsSW, boundsNE], { padding: 16, linear: true });
        }

        for (const key of Object.keys(dialogKit.status.filter.type)) {
            dialogKit.status.filter.type[key].label.innerHTML = toolkit.getCountString(dialogKit.status.filter.type[key].portals, process.portalList);
        }
        for (const key of Object.keys(dialogKit.status.filter.rejectedReason)) {
            const filter = dialogKit.status.filter.rejectedReason[key];
            dialogKit.status.filter.rejectedReason[key].label.innerHTML = toolkit.getCountString(filter.portals, dialogKit.status.filter.type.rejected.portals);
        }
        for (const key of Object.keys(dialogKit.status.block)) dialogKit.status.block[key].hidden = false;

        const onFinished = () => {
            ui.mainMap.updateData();
            ui.appBar.button.saveFile.root_.hidden = false;
            ui.appBar.button.uploadFile.root_.hidden = !gapi.auth2.getAuthInstance().isSignedIn.get();
            ui.progressBar.root_.hidden = true;
        };

        if (versionKit.fullFeature && (noLatLngList.length > 0)) {
            let count = 0;
            const countUp = () => {
                count += 1;
                if (count === noLatLngList.length) onFinished();
            };
            for (const portal of noLatLngList) {
                firebaseKit.queryLngLat(
                    portal.id,
                    (lngLat) => {
                        portal.lngLat = lngLat;
                        ui.fillLocation(portal, document.getElementById(`card-${portal.id}`));
                        countUp();
                    },
                    countUp
                );
            }
        } else {
            onFinished();
        }
    },
};
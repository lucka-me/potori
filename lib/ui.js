const ui = {
    dark: {
        enabled : false,
        onMediaQueryChanged: (mediaQueryList) => {
            ui.dark.enabled = mediaQueryList.matches;
            const style = mediaQueryList.matches ? value.string.mapbox.style.dark : value.string.mapbox.style.default;
            if (mapKit.ctrl) mapKit.ctrl.setStyle(style);
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
        if (mapKit.ctrl) mapKit.updateData();
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
                mapKit.ctrl.easeTo({ center: portal.lngLat, zoom: 16 })
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
            mapKit.ctrl.fitBounds([boundsSW, boundsNE], { padding: 16, linear: true });
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
            mapKit.updateData();
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
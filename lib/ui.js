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
        button: { },
        menu: {
            ctrl: null,
            item: { },
            event: {
                openFile:   (_) => fileKit.local.openFile(),
                saveFile:   (_) => fileKit.local.saveFile(),
                uploadFile: (_) => fileKit.googleDrive.uploadFile(),
                import:     (_) => dialogKit.import.ctrl.open(),
                signout:    (_) => auth.signOut(),
            },
            init: (appBarActionDiv) => {
                const menuAnchor = document.createElement('div');
                menuAnchor.className = 'mdc-menu-surface--anchor';
                const menuDiv = document.createElement('div');
                menuDiv.className = 'mdc-menu mdc-menu-surface';
                const menuList = document.createElement('ul');
                menuList.className = 'mdc-list';
                menuList.setAttribute('role', 'menu');
                menuList.setAttribute('aria-hidden', 'true');
                menuList.setAttribute('aria-orientation', 'vertical');
    
                for (const key of Object.keys(value.string.menu)) {
                    const menuItem = document.createElement("ul");
                    menuItem.className = "mdc-list-item";
                    menuItem.setAttribute("role", "menuitem");
                    menuItem.dataset.code = key;
                    const menuLabel = document.createElement("span");
                    menuLabel.className = "mdc-list-item__text";
                    menuLabel.innerHTML = value.string.menu[key].title;
                    menuItem.appendChild(menuLabel);
                    menuList.appendChild(menuItem);
                    ui.appBar.menu.item[key] = menuItem;
                }
    
                menuDiv.appendChild(menuList);
                menuAnchor.appendChild(menuDiv);
                appBarActionDiv.appendChild(menuAnchor);

                ui.appBar.menu.ctrl = new mdc.menu.MDCMenu(menuDiv);
                ui.appBar.menu.ctrl.listen("MDCMenu:selected", ui.appBar.menu.onSelected);
            },
            onSelected: (event) => {
                const key = event.detail.item.dataset.code;
                ui.appBar.menu.event[key]();
            },
            open: () => {
                if (!ui.appBar.menu.ctrl.open) {
                    ui.appBar.menu.ctrl.open = true;
                }
                
            },
        },
        event: {
            status: (_) => dialogKit.status.ctrl.open(),
            signin: (_) => auth.signIn(),
            menu:   (_) => ui.appBar.menu.open(),
        },
        init: () => {
            const appBarActionDiv = document.querySelector('.mdc-top-app-bar__section--align-end');
            for (const key of Object.keys(value.string.appBar)) {
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
            ui.appBar.menu.init(appBarActionDiv);
            ui.appBar.button.menu.root_.hidden = false;
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
        dialogKit.init();
    },
    refresh: () => {
        ui.appBar.menu.item.openFile.hidden = false;
        ui.appBar.menu.item.saveFile.hidden = true;
        for (const key of Object.keys(dialogKit.status.block)) dialogKit.status.block[key].hidden = true;
        ui.cardList.innerHTML = '';
        if (mapKit.isLoaded()) mapKit.updateData();
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
        
        ui.cardList.innerHTML = '';

        const noLatLngList = [];
        const boundsNE = { lng: -181.0, lat: -91.0 };
        const boundsSW = { lng:  181.0, lat:  91.0 };

        const extendBounds = (lngLat) => {
            if (lngLat.lng > boundsNE.lng) boundsNE.lng = lngLat.lng;
            else if (lngLat.lng < boundsSW.lng) boundsSW.lng = lngLat.lng;
            if (lngLat.lat > boundsNE.lat) boundsNE.lat = lngLat.lat;
            else if (lngLat.lat < boundsSW.lat) boundsSW.lat = lngLat.lat;
        };

        // Create cards and extend bounds
        for (const portal of process.portals) {
            const card = document.getElementById('template-card').content.cloneNode(true);

            card.querySelector('.mdc-card').id = `card-${portal.id}`;

            const mainAction = new mdc.ripple.MDCRipple(card.querySelector('.mdc-card__primary-action'));
            mainAction.listen('click', () => dialogKit.details.show(portal));

            card.querySelector('img').src = value.string.path.image + portal.image;
            card.querySelector('#cardTitle').innerHTML = portal.title;
            card.querySelector('#cardConfirmedTime').innerHTML = toolkit.getDateString(portal.confirmedTime);
            ui.fillCard(portal, card);

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

        if (noLatLngList.length < process.portals.length) {
            mapKit.ctrl.fitBounds([boundsSW, boundsNE], { padding: 16, linear: true });
        }

        dialogKit.status.update();

        for (const key of Object.keys(dialogKit.status.block)) {
            dialogKit.status.block[key].hidden = false;
        }

        const onFinished = () => {
            mapKit.updateData();
            ui.appBar.menu.item.saveFile.hidden = false;
            ui.appBar.menu.item.uploadFile.hidden = !gapi.auth2.getAuthInstance().isSignedIn.get();
            ui.appBar.menu.item.import.hidden = false;
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
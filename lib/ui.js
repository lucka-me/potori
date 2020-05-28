const ui = {
    dark: {
        enabled : false,
        onMediaQueryChanged: (mediaQueryList) => {
            ui.dark.enabled = mediaQueryList.matches;
            const style = value.string.mapbox.style[ui.dark.enabled ? 'dark' : 'default'];
            if (mapKit.isLoaded()) {
                mapKit.ctrl.setStyle(style);
                mapKit.ctrl.once('render', () => mapKit.updateData());
            }
            dashboard.updateStyle();
            if (dialogKit.details.map.ctrl) dialogKit.details.map.ctrl.setStyle(style);
        },
    },
    appBar: {
        button: { },
        menu: {
            ctrl: null,
            item: { },
            event: {
                openFile:   (_) => process.open(),
                saveFile:   (_) => process.save(),
                uploadFile: (_) => process.upload(),
                import:     (_) => dialogKit.import.ctrl.open(),
                about:      (_) => dialogKit.about.ctrl.open(),
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
                    menuItem.hidden = true;
                    ui.appBar.menu.item[key] = menuItem;
                }

                ui.appBar.menu.item.about.hidden = false;
    
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
            view:   (_) => ui.switchView(),
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
            ui.appBar.button.view.root_.hidden = false;
            ui.appBar.button.view.root_.id = 'button-appBar-view';
            ui.appBar.button.menu.root_.hidden = false;
        },
    },
    progressBar: new mdc.linearProgress.MDCLinearProgress(document.querySelector('#progress-bar')),
    cardList: document.getElementById('card-list'),
    init: () => {
        const darkMediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
        darkMediaQueryList.addListener(ui.dark.onMediaQueryChanged);
        ui.dark.onMediaQueryChanged(darkMediaQueryList);

        ui.appBar.init();
        dashboard.init();
        dialogKit.init();
    },
    switchView: () => {
        const switchToList = ui.appBar.button.view.root_.innerHTML === 'view_list' ? true : false;
        ui.appBar.button.view.root_.innerHTML = switchToList ? 'dashboard' : 'view_list';
        ui.appBar.button.view.root_.title = switchToList ? 'Dashboard' : 'List';
        document.querySelector('#dashboard').className = switchToList ? 'view-hide' : '';
        document.querySelector('#card-list').className = switchToList ? '' : 'view-hide';
    },
    clear: () => {
        ui.appBar.menu.item.openFile.hidden = false;
        ui.appBar.menu.item.saveFile.hidden = true;

        dashboard.setVisible(false);
        ui.cardList.innerHTML = '';
        if (mapKit.isLoaded()) mapKit.updateData();
        ui.progressBar.root_.hidden = true;
        ui.progressBar.buffer = 0;
        ui.progressBar.progress = 0;
    },
    updateLocation: (portal, card) => {
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
    updateCard: (portal, card) => {

        if (portal.status > 0) {
            card.querySelector('#text-card-interval').innerHTML = toolkit.getIntervalString(portal.confirmedTime, portal.resultTime);
            card.querySelector('#box-card-result').hidden = false;
            card.querySelector('#text-card-result').innerHTML = toolkit.getDateString(portal.resultTime);
        } else {
            card.querySelector('#text-card-interval').innerHTML = toolkit.getIntervalString(portal.confirmedTime, Date.now());
            card.querySelector('#box-card-result').hidden = true;
        }

        const matchedData = toolkit.matchData(portal.status);
        const type = toolkit.getTypeByCode(portal.status);
        card.querySelector('#icon-card-result').innerHTML = value.data.type[type].icon;

        const buttonStatus = card.querySelector('#button-card-status');
        buttonStatus.className = `mdc-button mdc-card__action mdc-card__action--button status-${type}`;
        buttonStatus.querySelector('i').innerHTML = matchedData.icon;
        buttonStatus.querySelector('span').innerHTML = matchedData.title;
    },
    updateCardVisibility: (portal, card) => {
        const type = toolkit.getTypeByCode(portal.status);
        if (type === 'rejected') {
            const reason = toolkit.getReasonByCode(portal.status);
            card.hidden = !dashboard.card.filter.reason[reason].checked;
        } else {
            card.hidden = !dashboard.card.filter.type[type].checked;
        }
    },
    display: () => {
        
        ui.cardList.innerHTML = '';

        const boundsNE = { lng: -181.0, lat: -91.0 };
        const boundsSW = { lng:  181.0, lat:  91.0 };

        const extendBounds = (lngLat) => {
            if (lngLat.lng > boundsNE.lng) boundsNE.lng = lngLat.lng;
            else if (lngLat.lng < boundsSW.lng) boundsSW.lng = lngLat.lng;
            if (lngLat.lat > boundsNE.lat) boundsNE.lat = lngLat.lat;
            else if (lngLat.lat < boundsSW.lat) boundsSW.lat = lngLat.lat;
        };

        // Create cards and extend bounds
        const timeNow = Date.now();
        for (const portal of process.portals) {
            const card = document.getElementById('template-card-portal').content.cloneNode(true);

            card.querySelector('.mdc-card').id = `card-${portal.id}`;

            const mainAction = new mdc.ripple.MDCRipple(card.querySelector('.mdc-card__primary-action'));
            mainAction.listen('click', () => dialogKit.details.show(portal));

            card.querySelector('img').src = value.string.path.image + portal.image;
            card.querySelector('.mdc-typography--headline6').innerHTML = portal.title;
            card.querySelector('#text-card-confirmed').innerHTML = toolkit.getDateString(portal.confirmedTime);
            const restoreTime = portal.confirmedTime + (14 * 24 * 3600 * 1000);
            if (restoreTime > timeNow) {
                card.querySelector('#text-card-restore').innerHTML = toolkit.getIntervalString(timeNow, restoreTime);
            } else {
                card.querySelector('#box-card-restore').hidden = true;
            }
            
            ui.updateCard(portal, card);

            const statusRipple = new mdc.ripple.MDCRipple(card.querySelector('#button-card-status'));
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
                ui.updateLocation(portal, card);
            }
            ui.cardList.appendChild(card);
        }

        if (boundsSW.lng > -181) {
            mapKit.ctrl.fitBounds([boundsSW, boundsNE], { padding: 16, linear: true });
        }

        dashboard.refresh();
        dashboard.setVisible(true);
        ui.appBar.menu.item.saveFile.hidden = false;
        ui.appBar.menu.item.uploadFile.hidden = !gapi.auth2.getAuthInstance().isSignedIn.get();
        ui.appBar.menu.item.import.hidden = false;
        ui.progressBar.root_.hidden = true;
    },
};
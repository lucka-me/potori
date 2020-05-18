const ui = {
    dark: {
        enabled : false,
        onMediaQueryChanged: (mediaQueryList) => {
            ui.dark.enabled = mediaQueryList.matches;
            const style = mediaQueryList.matches ? value.string.mapbox.style.dark : value.string.mapbox.style.default;
            if (ui.mainMap.ctrl) ui.mainMap.ctrl.setStyle(style);
            if (ui.dialog.details.map.ctrl) ui.dialog.details.map.ctrl.setStyle(style);
        },
    },
    appBar: {
        button: {
            status:   null,
            openFile: null, saveFile: null, uploadFile: null,
            auth:     null, signout:  null,
        },
        event: {
            status:     (_) => ui.dialog.status.ctrl.open(),
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
    dialog: {
        status: {
            ctrl: new mdc.dialog.MDCDialog(document.querySelector('#dialog-status')),
            block: {
                type:           document.getElementById('block-dialog-status-type'),
                rejectedReason: document.getElementById('block-dialog-status-rejectedReason'),
            },
            filter: { type: { }, rejectedReason: { }, },
            init: () => {
                const createSwitch = (block, key, type, title, icon) => {
                    const switchId = `switch-filter-${block}-${key}`;
                    const switchBox = document.getElementById('template-switchBox').content.cloneNode(true);
                    const switchElement = switchBox.querySelector('.mdc-switch');
                    switchElement.id = switchId;
                    const switchLabel = switchBox.querySelector('label');
                    switchLabel.for = switchId;
                    const labelIcon = switchLabel.querySelector('i');
                    labelIcon.className += ` status-${type}`;
                    labelIcon.title = title;
                    labelIcon.innerHTML = icon;
                    ui.dialog.status.block[block].appendChild(switchBox);
                    ui.dialog.status.filter[block][key] = {
                        switch: new mdc.switchControl.MDCSwitch(switchElement),
                        label: switchLabel.querySelector('span'),
                        portals: [],
                    };
                    return ui.dialog.status.filter[block][key].switch;
                };
                for (const key of Object.keys(value.data.rejectedReason)) {
                    const switchCtrl = createSwitch('rejectedReason', key, 'rejected', value.data.rejectedReason[key].title, value.data.rejectedReason[key].icon);
                    switchCtrl.listen('change', (_) => {
                        ui.dialog.status.changeShow(
                            ui.dialog.status.filter.rejectedReason[key],
                            `potori-rejected-${key}`
                        );
                    });
                }
                for (const key of Object.keys(value.data.type)) {
                    const switchCtrl = createSwitch('type', key, key, value.data.type[key].title, value.data.type[key].icon);
                    switchCtrl.listen(
                        'change',
                        (key === 'rejected') ? (_) => {
                            for (const key of Object.keys(ui.dialog.status.filter.rejectedReason)) {
                                ui.dialog.status.filter.rejectedReason[key].switch.checked =
                                    ui.dialog.status.filter.type.rejected.switch.checked;
                                ui.dialog.status.changeShow(
                                    ui.dialog.status.filter.rejectedReason[key],
                                    `potori-rejected-${key}`
                                );
                            }
                        } : (_) => {
                            ui.dialog.status.changeShow(ui.dialog.status.filter.type[key], `potori-${key}`);
                        }
                    );
                }
            },
            changeShow: (filter, id) => {
                const hidden = !filter.switch.checked;
                for (const portal of filter.portals) {
                    document.getElementById(`card-${portal.id}`).hidden = hidden;
                }
                const visibility = filter.switch.checked ? 'visible' : 'none'
                ui.mainMap.ctrl.setLayoutProperty(`${id}-cluster`      , 'visibility', visibility);
                ui.mainMap.ctrl.setLayoutProperty(`${id}-count`        , 'visibility', visibility);
                ui.mainMap.ctrl.setLayoutProperty(`${id}-unclustered`  , 'visibility', visibility);
            },
        },
        details: {
            ctrl: new mdc.dialog.MDCDialog(document.querySelector('#dialog-details')),
            map: {
                ctrl: null, marker: null,
                edit: null, search: null, delete: null,
                onEdit: () => {
                    const map = ui.dialog.details.map;
                    if (!map.marker) {
                        map.marker = new mapboxgl.Marker()
                            .setLngLat(map.ctrl.getCenter())
                            .setDraggable(true)
                            .addTo(map.ctrl);
                        map.delete.root_.disabled = false;
                        map.edit.root_.innerHTML = 'edit';
                    } else {
                        map.marker.setDraggable(true);
                    }
                },
                onSearch: () => {
                    const map = ui.dialog.details.map;
                    const onSuccess = (lngLat) => {
                        if (!ui.dialog.details.ctrl.isOpen) return;
                        if (!map.marker) {
                            map.marker = new mapboxgl.Marker()
                                .setLngLat(lngLat)
                                .addTo(map.ctrl);
                        } else {
                            map.marker.setLngLat(lngLat);
                        }
                        map.marker.setDraggable(false);
                        map.ctrl.easeTo({ center: lngLat, zoom: 16 });
                        map.edit.root_.innerHTML = 'edit';
                        map.search.root_.disabled = false;
                        map.delete.root_.disabled = false;
                    };
                    const onFailed = () => {
                        if (!ui.dialog.details.ctrl.isOpen) return;
                        ui.dialog.alert.show(value.string.alert.queryLngLatFailed);
                        map.search.root_.disabled = false;
                    }
                    ui.dialog.details.map.search.root_.disabled = true;
                    firebaseKit.queryLngLat(ui.dialog.details.data.portal.id, onSuccess, onFailed);
                },
                onDelete: () => {
                    const map = ui.dialog.details.map;
                    if (map.marker) map.marker.remove();
                    map.marker = null;
                    map.edit.root_.innerHTML = 'add';
                    map.delete.root_.disabled = true;
                },
            },
            status: { accepted: null, rejected: null, pending: null, },
            selectedStatus: null,
            rejectedReasonSelect: null,
            resultDateTimeField: null,
            data: { portal: null, keys: null },
            init: () => {
                const dialogElement = ui.dialog.details.ctrl.root_;
                const map = ui.dialog.details.map;
                map.ctrl = new mapboxgl.Map({
                    container: 'map-dialog-details',
                    style: ui.dark.enabled ? value.string.mapbox.style.dark : value.string.mapbox.style.default
                });
                map.ctrl.addControl(new mapboxgl.NavigationControl());
                map.edit = new mdc.ripple.MDCRipple(dialogElement.querySelector('#button-dialog-details-map-edit'));
                map.edit.unbounded = true;
                map.edit.listen('click', map.onEdit);
                map.search = new mdc.ripple.MDCRipple(dialogElement.querySelector('#button-dialog-details-map-search'));
                map.search.unbounded = true;
                if (versionKit.fullFeature) {
                    map.search.listen('click', map.onSearch);
                } else {
                    dialogElement.querySelector('#button-dialog-details-map-search').hidden = true;
                }
                map.delete = new mdc.ripple.MDCRipple(dialogElement.querySelector('#button-dialog-details-map-delete'));
                map.delete.unbounded = true;
                map.delete.listen('click', map.onDelete);
    
                ui.dialog.details.resultDateTimeField = new mdc.textField.MDCTextField(dialogElement.querySelector('#field-dialog-details-result-datetime'));

                const rejectedReasonSelectElement = dialogElement.querySelector('#select-dialog-details-rejectedReason');
                const selectList = rejectedReasonSelectElement.querySelector('ul');
                for (const key of Object.keys(value.data.rejectedReason)) {
                    const item = document.createElement('li');
                    item.className = 'mdc-list-item';
                    item.dataset.value = key;
                    item.innerHTML = value.data.rejectedReason[key].title;
                    selectList.appendChild(item);
                }
                ui.dialog.details.rejectedReasonSelect = new mdc.select.MDCSelect(rejectedReasonSelectElement);
                ui.dialog.details.rejectedReasonSelect.selectedIndex = 0;

                const onStatusRadioChange = (event) => {
                    ui.dialog.details.selectedStatus = event.target.value;
                    ui.dialog.details.resultDateTimeField.root_.hidden = (event.target.value === 'pending');
                    ui.dialog.details.resultDateTimeField.layout();
                    ui.dialog.details.rejectedReasonSelect.root_.hidden = !(event.target.value === 'rejected');
                    ui.dialog.details.rejectedReasonSelect.layout();
                    map.ctrl.resize();
                };

                const statusRadiosBlock = dialogElement.querySelector('#block-dialog-details-status-radios');
                for (const key of Object.keys(ui.dialog.details.status)) {
                    const radioId = `radio-dialog-details-status-${key}`;
                    const radioField = document.getElementById('template-radioField').content.cloneNode(true);
                    const radioFieldElement = radioField.querySelector('.mdc-form-field');
                    const radioInput = radioFieldElement.querySelector('input');
                    const radioLabel = radioFieldElement.querySelector('label');
                    radioInput.name = 'radio-dialog-details-status';
                    radioInput.id = radioId;
                    radioInput.value = key;
                    radioInput.addEventListener('change', onStatusRadioChange);
                    radioLabel.for = radioId;
                    radioLabel.className = `material-icons status-${key}`;
                    radioLabel.innerHTML = value.data.type[key].icon;
                    statusRadiosBlock.appendChild(radioFieldElement);

                    ui.dialog.details.status[key] = new mdc.radio.MDCRadio(radioFieldElement.querySelector('.mdc-radio'));
                    const formField = new mdc.formField.MDCFormField(radioFieldElement);
                    formField.input = ui.dialog.details.status[key];
                }
            },
            onOpened: () => {
                const portal = ui.dialog.details.data.portal;
                const keys = ui.dialog.details.data.keys;
                const map = ui.dialog.details.map;
                if (!map.ctrl) ui.dialog.details.init();
                map.ctrl.resize();
                if (map.marker) map.marker.remove();
                map.marker = null;
                if (portal.lngLat) {
                    map.marker = new mapboxgl.Marker() .setLngLat(portal.lngLat).addTo(map.ctrl);
                    map.ctrl.jumpTo({ center: portal.lngLat, zoom: 16 });
                    map.delete.root_.disabled = false;
                    map.edit.root_.innerHTML = 'edit';
                } else {
                    map.delete.root_.disabled = true;
                    map.edit.root_.innerHTML = 'add';
                }
                ui.dialog.details.map.search.root_.disabled = false;

                ui.dialog.details.status[keys.type].checked = true;
                ui.dialog.details.selectedStatus = keys.type;

                const dateTime = toolkit.getLocalDateTimeISOString(portal.resultTime ? portal.resultTime : Date.now());
                ui.dialog.details.resultDateTimeField.value = dateTime.slice(0, dateTime.lastIndexOf(':'));
                ui.dialog.details.resultDateTimeField.layout();

                if (keys.type === 'rejected') {
                    ui.dialog.details.rejectedReasonSelect.selectedIndex = portal.status - value.data.type.rejected.code;
                }
                ui.dialog.details.rejectedReasonSelect.layout();
            },
            onClosed: (event) => {
                const portal = ui.dialog.details.data.portal;
                const keys = ui.dialog.details.data.keys;
                const selectedStatus = ui.dialog.details.selectedStatus;
                if (event.detail.action === 'save') {
                    let shouldRefresh = false;
                    if (selectedStatus !== 'pending') {
                        const time = Date.parse(ui.dialog.details.resultDateTimeField.value);
                        if (!time) {
                            ui.dialog.alert.show(value.string.alert.invalidDateTime);
                            return;
                        }
                        const newTime = time + toolkit.getLocalTimezoneOffset();
                        if (!portal.resultTime || (Math.floor(portal.resultTime / 60000) !== Math.floor(newTime / 60000))) {
                            portal.resultTime = newTime;
                            shouldRefresh = true;
                        }
                    }
                    const filters = ui.dialog.status.filter;
                    const rejectedReason = ui.dialog.details.rejectedReasonSelect.value;
                    const removeOldReason = () => {
                        for (let i = 0; i < filters.rejectedReason[keys.rejectedReason].portals.length; i++) {
                            if (filters.rejectedReason[keys.rejectedReason].portals[i].id === portal.id) {
                                filters.rejectedReason[keys.rejectedReason].portals.splice(i, 1);
                                break;
                            }
                        }
                        filters.rejectedReason[keys.rejectedReason].label.innerHTML = toolkit.getCountString(filters.rejectedReason[keys.rejectedReason].portals, filters.type.rejected.portals);
                    };
                    const addNewReason = () => {
                        filters.rejectedReason[rejectedReason].portals.push(portal);
                        filters.rejectedReason[rejectedReason].label.innerHTML = toolkit.getCountString(filters.rejectedReason[rejectedReason].portals, filters.type.rejected.portals);
                    };
                    if (selectedStatus !== keys.type) {
                        for (let i = 0; i < filters.type[keys.type].portals.length; i++) {
                            if (filters.type[keys.type].portals[i].id === portal.id) {
                                filters.type[keys.type].portals.splice(i, 1);
                                break;
                            }
                        }
                        filters.type[selectedStatus].portals.push(portal);
                        filters.type[keys.type].label.innerHTML = toolkit.getCountString(filters.type[keys.type].portals, process.portalList);
                        filters.type[selectedStatus].label.innerHTML = toolkit.getCountString(filters.type[selectedStatus].portals, process.portalList);

                        if (keys.rejectedReason) {
                            removeOldReason();
                        } else if (selectedStatus === 'rejected') {
                            addNewReason();
                        }
                        shouldRefresh = true;
                    } else if ((keys.type === 'rejected') && (keys.rejectedReason !== rejectedReason)) {
                        removeOldReason();
                        addNewReason();
                        shouldRefresh = true;
                    }
                    if (ui.dialog.details.map.marker) {
                        const lngLat = ui.dialog.details.map.marker.getLngLat();
                        if (!portal.lngLat || (portal.lngLat.lng !== lngLat.lng || portal.lngLat.lat !== lngLat.lat)) {
                            portal.lngLat = lngLat;
                            shouldRefresh = true;
                        }
                    } else if (portal.lngLat) {
                        portal.lngLat = null;
                        shouldRefresh = true;
                    }
                    if (shouldRefresh) {
                        if (ui.dialog.details.selectedStatus !== 'rejected') {
                            portal.status = value.data.type[ui.dialog.details.selectedStatus].code;
                        } else {
                            portal.status = value.data.rejectedReason[ui.dialog.details.rejectedReasonSelect.value].code;
                        }
                        const card = document.getElementById(`card-${portal.id}`);
                        ui.fillCard(portal, card);
                        ui.fillLocation(portal, card);
                        ui.mainMap.updateData();
                    }
                }
            },
            show: (portal) => {
                ui.dialog.details.data.portal = portal;
                const keys = { type: toolkit.getTypeByCode(portal.status), rejectedReason: toolkit.getRejectedReasonByCode(portal.status) };
                ui.dialog.details.data.keys = keys;

                ui.dialog.details.ctrl.root_.querySelector('.mdc-dialog__title').innerHTML = portal.title;
                ui.dialog.details.ctrl.root_.querySelector('img').src = value.string.path.image + portal.image;
                ui.dialog.details.ctrl.root_.querySelector('#text-dialog-details-confirmedTime').innerHTML = toolkit.getDateTimeString(portal.confirmedTime);
                ui.dialog.details.ctrl.root_.querySelector('#field-dialog-details-result-datetime').hidden = (portal.status === 0);
                ui.dialog.details.ctrl.root_.querySelector('#select-dialog-details-rejectedReason').hidden = !(keys.type === 'rejected');
                ui.dialog.details.ctrl.open();
            }
        },
        alert:  {
            ctrl: new mdc.dialog.MDCDialog(document.querySelector('#dialog-alert')),
            show: (message) => {
                ui.dialog.alert.ctrl.open();
                ui.dialog.alert.ctrl.root_.querySelector('#dialogAlertMessageBox').innerHTML = message;
            },
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
                            20, 100,
                            30, 750,
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
                ui.mainMap.generateGeoJSON(ui.dialog.status.filter.type.pending.portals)
            );
            ui.mainMap.updateSource(
                'potori-accepted', 'accepted',
                ui.mainMap.generateGeoJSON(ui.dialog.status.filter.type.accepted.portals)
            );
            for (const key of Object.keys(ui.dialog.status.filter.rejectedReason)) {
                ui.mainMap.updateSource(
                    `potori-rejected-${key}`, 'rejected',
                    ui.mainMap.generateGeoJSON(ui.dialog.status.filter.rejectedReason[key].portals)
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
        ui.dialog.status.init();

        ui.dialog.details.ctrl.listen('MDCDialog:opened', ui.dialog.details.onOpened);
        ui.dialog.details.ctrl.listen('MDCDialog:closed', ui.dialog.details.onClosed);
    },
    refresh: () => {
        ui.appBar.button.openFile.root_.hidden = false;
        ui.appBar.button.saveFile.root_.hidden = true;
        for (const key of Object.keys(ui.dialog.status.block)) ui.dialog.status.block[key].hidden = true;
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

        for (const block of Object.keys(ui.dialog.status.filter)) {
            for (const key of Object.keys(ui.dialog.status.filter[block])) {
                ui.dialog.status.filter[block][key].portals = [];
            }
        }

        // Create cards, extend bounds and classify
        for (const portal of process.portalList) {
            const card = document.getElementById('template-card').content.cloneNode(true);

            card.querySelector('.mdc-card').id = `card-${portal.id}`;

            const mainAction = new mdc.ripple.MDCRipple(card.querySelector('.mdc-card__primary-action'));
            mainAction.listen('click', () => ui.dialog.details.show(portal));

            card.querySelector('img').src = value.string.path.image + portal.image;
            card.querySelector('#cardTitle').innerHTML = portal.title;
            card.querySelector('#cardConfirmedTime').innerHTML = toolkit.getDateString(portal.confirmedTime);
            ui.fillCard(portal, card);
            ui.dialog.status.filter.type[toolkit.getTypeByCode(portal.status)].portals.push(portal);
            if (portal.status > 100) {
                ui.dialog.status.filter.rejectedReason[toolkit.getRejectedReasonByCode(portal.status)].portals.push(portal);
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
                    ui.dialog.alert.show(`Brainstorming ID copied: ${portal.id}`);
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

        for (const key of Object.keys(ui.dialog.status.filter.type)) {
            ui.dialog.status.filter.type[key].label.innerHTML = toolkit.getCountString(ui.dialog.status.filter.type[key].portals, process.portalList);
        }
        for (const key of Object.keys(ui.dialog.status.filter.rejectedReason)) {
            const filter = ui.dialog.status.filter.rejectedReason[key];
            ui.dialog.status.filter.rejectedReason[key].label.innerHTML = toolkit.getCountString(filter.portals, ui.dialog.status.filter.type.rejected.portals);
        }
        for (const key of Object.keys(ui.dialog.status.block)) ui.dialog.status.block[key].hidden = false;

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
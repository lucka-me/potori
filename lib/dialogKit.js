const dialogKit = {
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
                dialogKit.status.block[block].appendChild(switchBox);
                dialogKit.status.filter[block][key] = {
                    switch: new mdc.switchControl.MDCSwitch(switchElement),
                    label: switchLabel.querySelector('span'),
                    portals: [],
                };
                return dialogKit.status.filter[block][key].switch;
            };
            for (const key of Object.keys(value.data.rejectedReason)) {
                const switchCtrl = createSwitch(
                    'rejectedReason', key, 'rejected',
                    value.data.rejectedReason[key].title, value.data.rejectedReason[key].icon
                );
                switchCtrl.listen('change', (_) => {
                    dialogKit.status.switchRejecteReason(key);
                });
            }
            for (const key of Object.keys(value.data.type)) {
                const switchCtrl = createSwitch(
                    'type', key, key,
                    value.data.type[key].title, value.data.type[key].icon
                );
                switchCtrl.listen(
                    'change',
                    (_) => {
                        if (key === 'rejected') {
                            for (const key of Object.keys(dialogKit.status.filter.rejectedReason)) {
                                dialogKit.status.filter.rejectedReason[key].switch.checked =
                                    dialogKit.status.filter.type.rejected.switch.checked;
                            }
                            mapKit.updateRejectedFilter();
                        }
                        dialogKit.status.switchType(key);
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
            mapKit.ctrl.setLayoutProperty(`${id}-cluster`      , 'visibility', visibility);
            mapKit.ctrl.setLayoutProperty(`${id}-count`        , 'visibility', visibility);
            mapKit.ctrl.setLayoutProperty(`${id}-unclustered`  , 'visibility', visibility);
        },
        switchType: (type) => {
            const filter = dialogKit.status.filter.type[type];
            const hidden = !filter.switch.checked;
            for (const portal of filter.portals) {
                document.getElementById(`card-${portal.id}`).hidden = hidden;
            }
            const visibility = filter.switch.checked ? 'visible' : 'none'
            mapKit.ctrl.setLayoutProperty(`potori-${type}-cluster`      , 'visibility', visibility);
            mapKit.ctrl.setLayoutProperty(`potori-${type}-count`        , 'visibility', visibility);
            mapKit.ctrl.setLayoutProperty(`potori-${type}-unclustered`  , 'visibility', visibility);
        },
        switchRejecteReason: (reason) => {
            const filter = dialogKit.status.filter.rejectedReason[reason];
            const hidden = !filter.switch.checked;
            for (const portal of filter.portals) {
                document.getElementById(`card-${portal.id}`).hidden = hidden;
            }
            mapKit.updateRejectedFilter();
        },
    },
    details: {
        ctrl: new mdc.dialog.MDCDialog(document.querySelector('#dialog-details')),
        map: {
            ctrl: null, marker: null,
            edit: null, search: null, delete: null,
            onEdit: () => {
                const map = dialogKit.details.map;
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
                const map = dialogKit.details.map;
                const onSuccess = (lngLat) => {
                    if (!dialogKit.details.ctrl.isOpen) return;
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
                    if (!dialogKit.details.ctrl.isOpen) return;
                    dialogKit.alert.show(value.string.alert.queryLngLatFailed);
                    map.search.root_.disabled = false;
                }
                dialogKit.details.map.search.root_.disabled = true;
                firebaseKit.queryLngLat(dialogKit.details.data.portal.id, onSuccess, onFailed);
            },
            onDelete: () => {
                const map = dialogKit.details.map;
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
            const dialogElement = dialogKit.details.ctrl.root_;
            const map = dialogKit.details.map;
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

            dialogKit.details.resultDateTimeField = new mdc.textField.MDCTextField(dialogElement.querySelector('#field-dialog-details-result-datetime'));

            const rejectedReasonSelectElement = dialogElement.querySelector('#select-dialog-details-rejectedReason');
            const selectList = rejectedReasonSelectElement.querySelector('ul');
            for (const key of Object.keys(value.data.rejectedReason)) {
                const item = document.createElement('li');
                item.className = 'mdc-list-item';
                item.dataset.value = key;
                item.innerHTML = value.data.rejectedReason[key].title;
                selectList.appendChild(item);
            }
            dialogKit.details.rejectedReasonSelect = new mdc.select.MDCSelect(rejectedReasonSelectElement);
            dialogKit.details.rejectedReasonSelect.selectedIndex = 0;

            const onStatusRadioChange = (event) => {
                dialogKit.details.selectedStatus = event.target.value;
                dialogKit.details.resultDateTimeField.root_.hidden = (event.target.value === 'pending');
                dialogKit.details.resultDateTimeField.layout();
                dialogKit.details.rejectedReasonSelect.root_.hidden = !(event.target.value === 'rejected');
                dialogKit.details.rejectedReasonSelect.layout();
                map.ctrl.resize();
            };

            const statusRadiosBlock = dialogElement.querySelector('#block-dialog-details-status-radios');
            for (const key of Object.keys(dialogKit.details.status)) {
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

                dialogKit.details.status[key] = new mdc.radio.MDCRadio(radioFieldElement.querySelector('.mdc-radio'));
                const formField = new mdc.formField.MDCFormField(radioFieldElement);
                formField.input = dialogKit.details.status[key];
            }
        },
        onOpened: () => {
            const portal = dialogKit.details.data.portal;
            const keys = dialogKit.details.data.keys;
            const map = dialogKit.details.map;
            if (!map.ctrl) dialogKit.details.init();
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
            dialogKit.details.map.search.root_.disabled = false;

            dialogKit.details.status[keys.type].checked = true;
            dialogKit.details.selectedStatus = keys.type;

            const dateTime = toolkit.getLocalDateTimeISOString(portal.resultTime ? portal.resultTime : Date.now());
            dialogKit.details.resultDateTimeField.value = dateTime.slice(0, dateTime.lastIndexOf(':'));
            dialogKit.details.resultDateTimeField.layout();

            if (keys.type === 'rejected') {
                dialogKit.details.rejectedReasonSelect.selectedIndex = portal.status - value.data.type.rejected.code;
            }
            dialogKit.details.rejectedReasonSelect.layout();
        },
        onClosed: (event) => {
            const portal = dialogKit.details.data.portal;
            const keys = dialogKit.details.data.keys;
            const selectedStatus = dialogKit.details.selectedStatus;
            if (event.detail.action === 'save') {
                let shouldRefresh = false;
                if (selectedStatus !== 'pending') {
                    const time = Date.parse(dialogKit.details.resultDateTimeField.value);
                    if (!time) {
                        dialogKit.alert.show(value.string.alert.invalidDateTime);
                        return;
                    }
                    const newTime = time + toolkit.getLocalTimezoneOffset();
                    if (!portal.resultTime || (Math.floor(portal.resultTime / 60000) !== Math.floor(newTime / 60000))) {
                        portal.resultTime = newTime;
                        shouldRefresh = true;
                    }
                }
                const filters = dialogKit.status.filter;
                const rejectedReason = dialogKit.details.rejectedReasonSelect.value;
                const removeOldReason = () => {
                    for (let i = 0; i < filters.rejectedReason[keys.rejectedReason].portals.length; i++) {
                        if (filters.rejectedReason[keys.rejectedReason].portals[i].id === portal.id) {
                            filters.rejectedReason[keys.rejectedReason].portals.splice(i, 1);
                            break;
                        }
                    }
                    filters.rejectedReason[keys.rejectedReason].label.innerHTML =
                        toolkit.getCountString(
                            filters.rejectedReason[keys.rejectedReason].portals,
                            filters.type.rejected.portals
                        );
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
                if (dialogKit.details.map.marker) {
                    const lngLat = dialogKit.details.map.marker.getLngLat();
                    if (!portal.lngLat || (portal.lngLat.lng !== lngLat.lng || portal.lngLat.lat !== lngLat.lat)) {
                        portal.lngLat = lngLat;
                        shouldRefresh = true;
                    }
                } else if (portal.lngLat) {
                    portal.lngLat = null;
                    shouldRefresh = true;
                }
                if (shouldRefresh) {
                    if (dialogKit.details.selectedStatus !== 'rejected') {
                        portal.status = value.data.type[dialogKit.details.selectedStatus].code;
                    } else {
                        portal.status = value.data.rejectedReason[dialogKit.details.rejectedReasonSelect.value].code;
                    }
                    const card = document.getElementById(`card-${portal.id}`);
                    ui.fillCard(portal, card);
                    ui.fillLocation(portal, card);
                    mapKit.updateData();
                }
            }
        },
        show: (portal) => {
            dialogKit.details.data.portal = portal;
            const keys = { type: toolkit.getTypeByCode(portal.status), rejectedReason: toolkit.getRejectedReasonByCode(portal.status) };
            dialogKit.details.data.keys = keys;

            dialogKit.details.ctrl.root_.querySelector('.mdc-dialog__title').innerHTML = portal.title;
            dialogKit.details.ctrl.root_.querySelector('img').src = value.string.path.image + portal.image;
            dialogKit.details.ctrl.root_.querySelector('#text-dialog-details-confirmedTime').innerHTML = toolkit.getDateTimeString(portal.confirmedTime);
            dialogKit.details.ctrl.root_.querySelector('#field-dialog-details-result-datetime').hidden = (portal.status === 0);
            dialogKit.details.ctrl.root_.querySelector('#select-dialog-details-rejectedReason').hidden = !(keys.type === 'rejected');
            dialogKit.details.ctrl.open();
        }
    },
    alert:  {
        ctrl: new mdc.dialog.MDCDialog(document.querySelector('#dialog-alert')),
        show: (message) => {
            dialogKit.alert.ctrl.open();
            dialogKit.alert.ctrl.root_.querySelector('#dialogAlertMessageBox').innerHTML = message;
        },
    },
};
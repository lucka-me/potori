const DialogPrototype = {
    ctrl: null,
    init() { },
    open() { },
};

const dialog = {
    about: DialogPrototype,
    details: {
        ctrl: new mdc.dialog.MDCDialog(document.querySelector('#dialog-details')),
        map: {
            ctrl: null, marker: null,
            button: { edit: null, search: null, delete: null, },
            edit: () => {
                const map = dialog.details.map;
                if (!map.marker) {
                    map.marker = new mapboxgl.Marker()
                        .setLngLat(map.ctrl.getCenter())
                        .setDraggable(true)
                        .addTo(map.ctrl);
                    map.button.delete.root_.disabled = false;
                    map.button.edit.root_.innerHTML = 'edit';
                } else {
                    map.marker.setDraggable(true);
                }
            },
            search: () => {
                const map = dialog.details.map;
                const onSuccess = (lngLat) => {
                    if (!dialog.details.ctrl.isOpen) return;
                    if (!map.marker) {
                        map.marker = new mapboxgl.Marker()
                            .setLngLat(lngLat)
                            .addTo(map.ctrl);
                    } else {
                        map.marker.setLngLat(lngLat);
                    }
                    map.marker.setDraggable(false);
                    map.ctrl.easeTo({ center: lngLat, zoom: 16 });
                    map.button.edit.root_.innerHTML = 'edit';
                    map.button.search.root_.disabled = false;
                    map.button.delete.root_.disabled = false;
                };
                const onFailed = () => {
                    if (!dialog.details.ctrl.isOpen) return;
                    dialog.alert.show(value.string.alert.queryLngLatFailed);
                    map.button.search.root_.disabled = false;
                }
                dialog.details.map.button.search.root_.disabled = true;
                bsKit.queryLngLat(
                    dialog.details.data.portal.id, onSuccess, onFailed
                );
            },
            delete: () => {
                const map = dialog.details.map;
                if (map.marker) map.marker.remove();
                map.marker = null;
                map.button.edit.root_.innerHTML = 'add';
                map.button.delete.root_.disabled = true;
            },
        },
        status: { accepted: null, rejected: null, pending: null, },
        selectedStatus: null,
        reasonSelect: null,
        resultDateTimeField: null,
        data: { portal: null, keys: null },
        init: () => {
            const dialogElement = dialog.details.ctrl.root_;
            const map = dialog.details.map;
            map.ctrl = new mapboxgl.Map({
                container: 'map-dialog-details',
                style: ui.dark.enabled ? value.string.mapbox.style.dark : value.string.mapbox.style.default
            });
            map.ctrl.addControl(new mapboxgl.NavigationControl());
            const bottonBox = dialogElement.querySelector('#box-bottons');
            for (const key of Object.keys(map.button)) {
                const buttonElement = document.createElement('button');
                buttonElement.className = 'mdc-icon-button material-icons';
                buttonElement.innerHTML = key;
                map.button[key] = new mdc.ripple.MDCRipple(buttonElement);
                map.button[key].unbounded = true;
                map.button[key].listen('click', map[key]);
                bottonBox.appendChild(buttonElement);
            }

            dialog.details.resultDateTimeField = new mdc.textField.MDCTextField(dialogElement.querySelector('#field-dialog-details-result-datetime'));

            const reasonSelectElement = dialogElement.querySelector('#select-dialog-details-reason');
            const selectList = reasonSelectElement.querySelector('ul');
            for (const key of Object.keys(value.data.reason)) {
                const item = document.createElement('li');
                item.className = 'mdc-list-item';
                item.dataset.value = key;
                item.innerHTML = value.data.reason[key].title;
                selectList.appendChild(item);
            }
            dialog.details.reasonSelect = new mdc.select.MDCSelect(reasonSelectElement);
            dialog.details.reasonSelect.selectedIndex = 0;

            const onStatusRadioChange = (event) => {
                dialog.details.selectedStatus = event.target.value;
                dialog.details.resultDateTimeField.root_.hidden = (event.target.value === 'pending');
                dialog.details.resultDateTimeField.layout();
                dialog.details.reasonSelect.root_.hidden = !(event.target.value === 'rejected');
                dialog.details.reasonSelect.layout();
                map.ctrl.resize();
            };

            const statusRadiosBlock = dialogElement.querySelector('#block-dialog-details-status-radios');
            for (const key of Object.keys(dialog.details.status)) {
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

                dialog.details.status[key] = new mdc.radio.MDCRadio(radioFieldElement.querySelector('.mdc-radio'));
                const formField = new mdc.formField.MDCFormField(radioFieldElement);
                formField.input = dialog.details.status[key];
            }
        },
        onOpened: () => {
            const portal = dialog.details.data.portal;
            const keys = dialog.details.data.keys;
            const map = dialog.details.map;
            if (!map.ctrl) dialog.details.init();
            map.ctrl.resize();
            if (map.marker) map.marker.remove();
            map.marker = null;
            if (portal.lngLat) {
                map.marker = new mapboxgl.Marker() .setLngLat(portal.lngLat).addTo(map.ctrl);
                map.ctrl.jumpTo({ center: portal.lngLat, zoom: 16 });
                map.button.delete.root_.disabled = false;
                map.button.edit.root_.innerHTML = 'edit';
            } else {
                map.button.delete.root_.disabled = true;
                map.button.edit.root_.innerHTML = 'add';
            }
            dialog.details.map.button.search.root_.disabled = false;

            dialog.details.status[keys.type].checked = true;
            dialog.details.selectedStatus = keys.type;

            const dateTime = toolkit.getLocalDateTimeISOString(portal.resultTime ? portal.resultTime : Date.now());
            dialog.details.resultDateTimeField.value = dateTime.slice(0, dateTime.lastIndexOf(':'));
            dialog.details.resultDateTimeField.layout();

            if (keys.type === 'rejected') {
                dialog.details.reasonSelect.selectedIndex = portal.status - value.data.type.rejected.code;
            }
            if (keys.type === 'pending') {
                bsKit.query(portal.id, (data) => {
                    const dateTime = toolkit.getLocalDateTimeISOString(data.lastTime);
                    dialog.details.resultDateTimeField.value = dateTime.slice(0, dateTime.lastIndexOf(':'));
                    dialog.details.resultDateTimeField.layout();
                }, () => null);
            }
            dialog.details.reasonSelect.layout();
        },
        onClosed: (event) => {
            const portal = dialog.details.data.portal;
            const keys = dialog.details.data.keys;
            const selectedStatus = dialog.details.selectedStatus;
            if (event.detail.action === 'save') {
                let shouldUpdate = false;
                if (selectedStatus !== 'pending') {
                    const time = Date.parse(dialog.details.resultDateTimeField.value);
                    if (!time) {
                        dialog.alert.show(value.string.alert.invalidDateTime);
                        return;
                    }
                    const newTime = time + toolkit.getLocalTimezoneOffset();
                    if (!portal.resultTime || (Math.floor(portal.resultTime / 60000) !== Math.floor(newTime / 60000))) {
                        portal.resultTime = newTime;
                        shouldUpdate = true;
                    }
                }
                const reason = dialog.details.reasonSelect.value;
                if (selectedStatus !== keys.type) {
                    shouldUpdate = true;
                } else if ((keys.type === 'rejected') && (keys.reason !== reason)) {
                    shouldUpdate = true;
                }
                if (dialog.details.map.marker) {
                    const lngLat = dialog.details.map.marker.getLngLat();
                    if (!portal.lngLat || (portal.lngLat.lng !== lngLat.lng || portal.lngLat.lat !== lngLat.lat)) {
                        portal.lngLat = lngLat;
                        shouldUpdate = true;
                    }
                } else if (portal.lngLat) {
                    portal.lngLat = null;
                    shouldUpdate = true;
                }
                if (shouldUpdate) {
                    if (dialog.details.selectedStatus !== 'rejected') {
                        portal.status = value.data.type[dialog.details.selectedStatus].code;
                    } else {
                        portal.status = value.data.reason[dialog.details.reasonSelect.value].code;
                    }
                    const card = document.getElementById(`card-${portal.id}`);
                    ui.updateCard(portal, card);
                    ui.updateLocation(portal, card);
                    ui.updateCardVisibility(portal, card);
                    dashboard.update();
                }
            }
        },
        show: (portal) => {
            dialog.details.data.portal = portal;
            const keys = {
                type: toolkit.getTypeByCode(portal.status),
                reason: toolkit.getReasonByCode(portal.status)
            };
            dialog.details.data.keys = keys;

            dialog.details.ctrl.root_.querySelector('.mdc-dialog__title').innerHTML = portal.title;
            dialog.details.ctrl.root_.querySelector('img').src = value.string.path.image + portal.image;
            dialog.details.ctrl.root_.querySelector('#text-dialog-details-confirmedTime').innerHTML = toolkit.getDateTimeString(portal.confirmedTime);
            dialog.details.ctrl.root_.querySelector('#field-dialog-details-result-datetime').hidden = (portal.status === 0);
            dialog.details.ctrl.root_.querySelector('#select-dialog-details-reason').hidden = !(keys.type === 'rejected');
            dialog.details.ctrl.open();
        }
    },
    import: {
        ctrl: new mdc.dialog.MDCDialog(document.querySelector('#dialog-import')),
        textarea: new mdc.textField.MDCTextField(document.querySelector('#dialog-import .mdc-text-field')),
        init: () => {
            dialog.import.ctrl.listen('MDCDialog:closed', dialog.import.onClosed);
        },
        show: () => {
            dialog.import.ctrl.open();
        },
        onClosed: (event) => {
            if (event.detail.action === 'import') {
                process.import(dialog.import.textarea.value);
            }
        },
    },
    alert:  {
        ctrl: new mdc.dialog.MDCDialog(document.querySelector('#dialog-alert')),
        show: (message) => {
            dialog.alert.ctrl.open();
            dialog.alert.ctrl.root_.querySelector('#box-alert-message').innerHTML = message;
        },
    },
    init: () => {
        dialog.about.init();

        dialog.details.ctrl.listen('MDCDialog:opened', dialog.details.onOpened);
        dialog.details.ctrl.listen('MDCDialog:closed', dialog.details.onClosed);

        dialog.import.init();
    },
};
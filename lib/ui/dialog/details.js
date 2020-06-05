import { DialogPrototype } from '../prototype.js';

class DetailsDialogMap extends DialogPrototype {
    constructor() {
        super();
        this.ctrl = null;
        this.marker = null;
        this.button = { edit: null, search: null, delete: null, };
    }

    edit() {
        if (!this.marker) {
            this.marker = new mapboxgl.Marker()
                .setLngLat(map.ctrl.getCenter())
                .setDraggable(true)
                .addTo(map.ctrl);
            this.button.delete.root_.disabled = false;
            this.button.edit.root_.innerHTML = 'edit';
        } else {
            this.marker.setDraggable(true);
        }
    }

    search() {
        const onSuccess = (lngLat) => {
            if (!dialog.details.ctrl.isOpen) return;
            if (!this.marker) {
                this.marker = new mapboxgl.Marker()
                    .setLngLat(lngLat)
                    .addTo(this.ctrl);
            } else {
                this.marker.setLngLat(lngLat);
            }
            this.marker.setDraggable(false);
            this.ctrl.easeTo({ center: lngLat, zoom: 16 });
            this.button.edit.root_.innerHTML = 'edit';
            this.button.search.root_.disabled = false;
            this.button.delete.root_.disabled = false;
        };
        const onFailed = () => {
            if (!dialog.details.ctrl.isOpen) return;
            dialog.alert.open(value.string.alert.queryLngLatFailed);
            this.button.search.root_.disabled = false;
        }
        this.button.search.root_.disabled = true;
        bsKit.queryLngLat(
            dialog.details.portal.id, onSuccess, onFailed
        );
    }

    delete() {
        if (this.marker) this.marker.remove();
        this.marker = null;
        this.button.edit.root_.innerHTML = 'add';
        this.button.delete.root_.disabled = true;
    }
}

class DetailsDialog extends DialogPrototype {
    constructor() {
        super();
        this.textConfirmedTime = null;
        this.status = { accepted: null, rejected: null, pending: null, };
        this.selectedStatus = null;
        this.fieldResultTime = null;
        this.selectReason = null;
        this.portal = null;
        this.map = new DetailsDialogMap();
    }

    init(parent) {
        this.textConfirmedTime = eliKit.build('span', {
            className: 'margin-l--4'
        });

        const statusRadios = [];
        for (const key of Object.keys(dialog.details.status)) {
            const radioId = `radio-dialog-details-status-${key}`;

            const inputRadio = eliKit.build('input', {
                type: 'radio',
                className: 'mdc-radio__native-control',
                name: 'radio-dialog-details-status',
                value: key,
            });
            inputRadio.addEventListener('change', (event) => {
                this.selectedStatus = event.target.value;
                this.fieldResultTime.root_.hidden = (event.target.value === 'pending');
                this.fieldResultTime.layout();
                this.selectReason.root_.hidden = !(event.target.value === 'rejected');
                this.selectReason.layout();
                this.map.ctrl.resize();
            });
            const elementRadio = eliKit.build('div', {
                className: 'mdc-radio',
                children: [
                    inputRadio,
                    eliKit.build('div', {
                        className: 'mdc-radio__background',
                        children: [
                            eliKit.build('div', { className: 'mdc-radio__outer-circle' }),
                            eliKit.build('div', { className: 'mdc-radio__inner-circle' }),
                        ],
                    }),
                ],
            });
            const elementField = eliKit.build('div', {
                className: 'mdc-form-field',
                children: [
                    elementRadio,
                    eliKit.build('label', {
                        for: radioId,
                        className: `material-icons status-${key}`,
                        innerHTML: value.data.type[key].icon,
                    }),
                ],
            });

            this.status[key] = new mdc.radio.MDCRadio(elementRadio);
            const field = new mdc.formField.MDCFormField(elementField);
            field.input = this.status[key];
            statusRadios.push(elementField)
        }

        const elementResultTime = eliKit.build('div', {
            className: [
                'mdc-text-field', 'mdc-text-field--outlined',
                'mdc-text-field--with-leading-icon',
                'margin-v--8', 'margin-h--4','flex-grow--1'
            ].join(' '),
            children: [
                eliKit.build('i', {
                    className: 'material-icons mdc-text-field__icon mdc-text-field__icon--leading',
                    innerHTML: 'event',
                }),
                eliKit.build('input', {
                    type: 'datetime-local',
                    className: 'mdc-text-field__input',
                    id: 'input-dialog-details-result-time',
                }),
                eliKit.notchedOutline({
                    for: 'input-dialog-details-result-time',
                    innerHTML: 'Result Time',
                }),
            ],
        });
        this.fieldResultTime = new mdc.textField.MDCTextField(elementResultTime);

        const itemsSelectReason = [];
        for (const key of Object.keys(value.data.reason)) {
            itemsSelectReason.push(eliKit.build('li', {
                className: 'mdc-list-item',
                dataset: { value: key },
                innerHTML: value.data.reason[key].title,
            }));
        }
        const elementReason = eliKit.build('div', {
            className: 'mdc-select mdc-select--outlined margin-v--8 margin-h--4',
            children: [
                eliKit.build('div', {
                    className: 'mdc-select__anchor',
                    children: [
                        eliKit.build('i', { className: 'mdc-select__dropdown-icon' }),
                        eliKit.build('div', { className: 'mdc-select__selected-text' }),
                        eliKit.notchedOutline({ innerHTML: 'Reason' }),
                    ],
                }),
                eliKit.build('div', {
                    className: 'mdc-select__menu mdc-menu mdc-menu-surface',
                    children: [
                        eliKit.build('ul', {
                            className: 'mdc-list', children: itemsSelectReason
                        }),
                    ],
                }),
            ],
        });
        this.selectReason = new mdc.select.MDCSelect(elementReason);
        this.selectReason.selectedIndex = 0;

        const mapButtons = [];
        for (const key of Object.keys(this.map.button)) {
            const elementButton = eliKit.build('button', {
                className: 'mdc-icon-button material-icons',
                innerHTML: key,
            });
            this.map.button[key] = new mdc.ripple.MDCRipple(elementButton);
            this.map.button[key].unbounded = true;
            this.map.button[key].listen('click', () => this.map[key]());
            mapButtons.push(elementButton);
        }
        const elementMap = eliKit.build('div', {
            className: 'flex-grow--1',
            styleText: 'min-height: 180px',
        });

        const contents = [
            eliKit.build('div', {
                className: 'mdc-typography--body1 flex-box-row--nowrap flex-align-items--center',
                children: [
                    eliKit.icon('arrow_upward'), this.textConfirmedTime,
                ],
            }),
            eliKit.build('div', {
                className: 'flex-box-row--nowrap fullwidth flex-justify-content--around',
                children: statusRadios,
            }),
            eliKit.build('div', {
                className: 'flex-box-row--wrap',
                children: [ elementResultTime, elementReason ],
            }),
            eliKit.build('div', {
                className: 'flex-box-row--nowrap margin-v--8',
                children: [
                    eliKit.build('div', {
                        className: 'flex-box-col flex-justify-content--around',
                        children: mapButtons,
                    }),
                    elementMap,
                ],
            }),
        ];
        const elementDialog = eliKit.dialog([
            eliKit.build('h2', {
                className: 'mdc-dialog__title',
                dataset: { mdcDialogInitialFocus: '' },
                innerHTML: 'Import',
            }),
            eliKit.build('img', {
                styleText: [
                    'object-fit:cover', 'object-position:center',
                    'width:100%', 'height:150px;'
                ].join(';')
            }),
            eliKit.build('div', {
                className: 'mdc-dialog__content',
                children: contents,
            }),
            eliKit.build('footer', {
                className: 'mdc-dialog__actions',
                children: [
                    eliKit.dialogAction('close', 'Close'),
                    eliKit.dialogAction('save' , 'Save' ),
                ],
            }),
        ]);
        parent.appendChild(elementDialog);
        this.ctrl = new mdc.dialog.MDCDialog(elementDialog);
        this.ctrl.listen('MDCDialog:opened', () => this.opened());
        this.ctrl.listen('MDCDialog:closed', (event) => this.closed(event));

        this.map.ctrl = new mapboxgl.Map({
            container: elementMap,
            style: value.string.mapbox.style[ui.dark.enabled ? 'dark' : 'default'],
        });
        this.map.ctrl.addControl(new mapboxgl.NavigationControl());
    }

    opened() {
        this.fieldResultTime.layout();
        this.selectReason.layout();
        this.map.ctrl.resize();
    }

    closed(event) {
        if (event.detail.action !== 'save') return;
        const keys = {
            type: toolkit.getTypeByCode(this.portal.status),
            reason: toolkit.getReasonByCode(this.portal.status),
        }
        const selectedStatus = dialog.details.selectedStatus;
        let shouldUpdate = false;
        if (selectedStatus !== 'pending') {
            const time = Date.parse(this.fieldResultTime.value);
            if (!time) {
                dialog.alert.open(value.string.alert.invalidDateTime);
                return;
            }
            const newTime = time + toolkit.getLocalTimezoneOffset();
            if (!this.portal.resultTime || (Math.floor(this.portal.resultTime / 60000) !== Math.floor(newTime / 60000))) {
                this.portal.resultTime = newTime;
                shouldUpdate = true;
            }
        }
        const reason = this.selectReason.value;
        if (selectedStatus !== keys.type) {
            shouldUpdate = true;
        } else if ((keys.type === 'rejected') && (keys.reason !== reason)) {
            shouldUpdate = true;
        }
        if (dialog.details.map.marker) {
            const lngLat = dialog.details.map.marker.getLngLat();
            if (!this.portal.lngLat || (this.portal.lngLat.lng !== lngLat.lng || this.portal.lngLat.lat !== lngLat.lat)) {
                this.portal.lngLat = lngLat;
                shouldUpdate = true;
            }
        } else if (this.portal.lngLat) {
            this.portal.lngLat = null;
            shouldUpdate = true;
        }
        if (shouldUpdate) {
            if (dialog.details.selectedStatus !== 'rejected') {
                this.portal.status = value.data.type[dialog.details.selectedStatus].code;
            } else {
                this.portal.status = value.data.reason[this.selectReason.value].code;
            }
            const card = document.getElementById(`card-${portal.id}`);
            ui.list.updateCard(this.portal, card);
            ui.list.updateLocation(this.portal, card);
            ui.list.updateVisibility(this.portal, card);
            ui.dashboardKit.update();
        }
    }

    open(portal) {
        this.portal = portal;
        const type = toolkit.getTypeByCode(portal.status);

        this.ctrl.root_.querySelector('.mdc-dialog__title').innerHTML = portal.title;
        this.ctrl.root_.querySelector('img').src = `${value.string.path.image}${portal.image}`;
        this.textConfirmedTime.innerHTML = toolkit.getDateTimeString(portal.confirmedTime);

        this.fieldResultTime.root_.hidden = (type === 'pending');
        const resultTimeString = toolkit.getLocalDateTimeISOString(
            portal.resultTime ? portal.resultTime : Date.now()
        );
        this.fieldResultTime.value = resultTimeString.slice(0, resultTimeString.lastIndexOf(':'));

        this.selectReason.root_.hidden = !(type === 'rejected');
        if (type === 'rejected') {
            this.selectReason.selectedIndex = portal.status - value.data.type.rejected.code;
        }
        if (type === 'pending') {
            bsKit.query(portal.id, (data) => {
                const timeString = toolkit.getLocalDateTimeISOString(data.lastTime);
                this.fieldResultTime.value = timeString.slice(0, timeString.lastIndexOf(':'));
                this.fieldResultTime.layout();
            }, () => null);
        }

        this.map.delete();
        if (this.portal.lngLat) {
            this.map.marker = new mapboxgl.Marker();
            this.map.marker.setLngLat(this.portal.lngLat).addTo(this.map.ctrl);
            this.map.ctrl.jumpTo({ center: this.portal.lngLat, zoom: 16 });
            this.map.button.delete.root_.disabled = false;
            this.map.button.edit.root_.innerHTML = 'edit';
        }
        this.map.button.search.root_.disabled = false;

        this.status[type].checked = true;
        this.selectedStatus = type;

        this.ctrl.open();
    }

    updateStyle() {
        if (!this.map.ctrl) return;
        this.map.ctrl.setStyle(
            value.string.mapbox.style[ui.dark.enabled ? 'dark' : 'default']
        );
    }
}

export { DetailsDialog };
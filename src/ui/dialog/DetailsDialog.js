import { UIKitPrototype } from '../protorypes.js';
import { DialogPrototype } from './prototypes.js';
import Eli from "../Eli";
import Toolkit from "../Toolkit.js";
import AlertDialog from './AlertDialog.js';
import Dark from '../Dark.js';
import Service from '../../service/Service.js';
import { MapStyle } from '../dashboard/MapCard.js';
import StatusKit from '../../service/StatusKit';

class DetailsDialogMap extends UIKitPrototype {
    constructor() {
        super();
        this.ctrl = null;
        this.marker = null;
        this.dialog = null;
        this.portal = null;
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
            if (!this.dialog.isOpen) return;
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
            if (!this.dialog.isOpen) return;
            AlertDialog.open('Unable to query the location.');
            this.button.search.root_.disabled = false;
        }
        this.button.search.root_.disabled = true;
        this.bs.queryLngLat(this.portal.id, onSuccess, onFailed);
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

        this.event = {
            update: (portal) => { portal },
        }
    }

    init(parent) {
        this.textConfirmedTime = Eli.build('span', {
            className: 'margin-l--4'
        });

        const statusRadios = [];
        for (const key of Object.keys(this.status)) {
            const radioId = `radio-dialog-details-status-${key}`;

            const inputRadio = Eli.build('input', {
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
            const elementRadio = Eli.build('div', {
                className: 'mdc-radio',
                children: [
                    inputRadio,
                    Eli.build('div', {
                        className: 'mdc-radio__background',
                        children: [
                            Eli.build('div', { className: 'mdc-radio__outer-circle' }),
                            Eli.build('div', { className: 'mdc-radio__inner-circle' }),
                        ],
                    }),
                ],
            });
            const elementField = Eli.build('div', {
                className: 'mdc-form-field',
                children: [
                    elementRadio,
                    Eli.build('label', {
                        for: radioId,
                        className: `material-icons status-${key}`,
                        innerHTML: StatusKit.types.get(key).icon,
                    }),
                ],
            });

            this.status[key] = new mdc.radio.MDCRadio(elementRadio);
            const field = new mdc.formField.MDCFormField(elementField);
            field.input = this.status[key];
            statusRadios.push(elementField)
        }

        const elementResultTime = Eli.build('div', {
            className: [
                'mdc-text-field', 'mdc-text-field--outlined',
                'mdc-text-field--with-leading-icon',
                'margin-v--8', 'margin-h--4','flex-grow--1'
            ].join(' '),
            children: [
                Eli.build('i', {
                    className: 'material-icons mdc-text-field__icon mdc-text-field__icon--leading',
                    innerHTML: 'event',
                }),
                Eli.build('input', {
                    type: 'datetime-local',
                    className: 'mdc-text-field__input',
                    id: 'input-dialog-details-result-time',
                }),
                Eli.notchedOutline({
                    for: 'input-dialog-details-result-time',
                    innerHTML: 'Result Time',
                }),
            ],
        });
        this.fieldResultTime = new mdc.textField.MDCTextField(elementResultTime);

        const itemsSelectReason = [];
        for (const [key, value] of StatusKit.reasons.entries()) {
            itemsSelectReason.push(Eli.build('li', {
                className: 'mdc-list-item',
                dataset: { value: key },
                innerHTML: value.title,
            }));
        }
        const elementReason = Eli.build('div', {
            className: 'mdc-select mdc-select--outlined margin-v--8 margin-h--4',
            children: [
                Eli.build('div', {
                    className: 'mdc-select__anchor',
                    children: [
                        Eli.build('i', { className: 'mdc-select__dropdown-icon' }),
                        Eli.build('div', { className: 'mdc-select__selected-text' }),
                        Eli.notchedOutline({ innerHTML: 'Reason' }),
                    ],
                }),
                Eli.build('div', {
                    className: 'mdc-select__menu mdc-menu mdc-menu-surface',
                    children: [
                        Eli.build('ul', {
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
            const elementButton = Eli.build('button', {
                className: 'mdc-icon-button material-icons',
                innerHTML: key,
            });
            this.map.button[key] = new mdc.ripple.MDCRipple(elementButton);
            this.map.button[key].unbounded = true;
            this.map.button[key].listen('click', () => this.map[key]());
            mapButtons.push(elementButton);
        }
        const elementMap = Eli.build('div', {
            className: 'flex-grow--1',
            styleText: 'min-height: 180px',
        });

        const contents = [
            Eli.build('div', {
                className: 'mdc-typography--body1 flex-box-row--nowrap flex-align-items--center',
                children: [
                    Eli.icon('arrow_upward'), this.textConfirmedTime,
                ],
            }),
            Eli.build('div', {
                className: 'flex-box-row--nowrap fullwidth flex-justify-content--around',
                children: statusRadios,
            }),
            Eli.build('div', {
                className: 'flex-box-row--wrap',
                children: [ elementResultTime, elementReason ],
            }),
            Eli.build('div', {
                className: 'flex-box-row--nowrap margin-v--8',
                children: [
                    Eli.build('div', {
                        className: 'flex-box-col flex-justify-content--around',
                        children: mapButtons,
                    }),
                    elementMap,
                ],
            }),
        ];
        const elementDialog = Eli.dialog([
            Eli.build('h2', {
                className: 'mdc-dialog__title',
                dataset: { mdcDialogInitialFocus: '' },
                innerHTML: 'Import',
            }),
            Eli.build('img', {
                styleText: [
                    'object-fit:cover', 'object-position:center',
                    'width:100%', 'height:150px;'
                ].join(';')
            }),
            Eli.build('div', {
                className: 'mdc-dialog__content',
                children: contents,
            }),
            Eli.build('footer', {
                className: 'mdc-dialog__actions',
                children: [
                    Eli.dialogAction('close', 'Close'),
                    Eli.dialogAction('save' , 'Save' ),
                ],
            }),
        ]);
        parent.appendChild(elementDialog);
        this.ctrl = new mdc.dialog.MDCDialog(elementDialog);
        this.ctrl.listen('MDCDialog:opened', () => this.opened());
        this.ctrl.listen('MDCDialog:closed', (event) => this.closed(event));

        this.map.dialog = this.ctrl;
        this.map.ctrl = new mapboxgl.Map({
            container: elementMap,
            style: MapStyle[Dark.enabled ? 'dark' : 'default'],
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
            type: StatusKit.getTypeByCode(this.portal.status),
            reason: StatusKit.getReasonByCode(this.portal.status),
        }
        const selectedStatus = this.selectedStatus;
        let shouldUpdate = false;
        if (selectedStatus !== 'pending') {
            const time = Date.parse(this.fieldResultTime.value);
            if (!time) {
                AlertDialog.open('Invalid DateTime.');
                return;
            }
            const newTime = time + Toolkit.getLocalTimezoneOffset();
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
        if (this.map.marker) {
            const lngLat = this.map.marker.getLngLat();
            if (!this.portal.lngLat || (this.portal.lngLat.lng !== lngLat.lng || this.portal.lngLat.lat !== lngLat.lat)) {
                this.portal.lngLat = lngLat;
                shouldUpdate = true;
            }
        } else if (this.portal.lngLat) {
            this.portal.lngLat = null;
            shouldUpdate = true;
        }
        if (shouldUpdate) {
            if (this.selectedStatus !== 'rejected') {
                this.portal.status = StatusKit.types.get(this.selectedStatus).code;
            } else {
                this.portal.status = StatusKit.reasons.get(this.selectReason.value).code;
            }
            this.event.update(this.portal);
        }
    }

    open(portal) {
        this.portal = portal;
        this.map.portal = portal;
        const type = StatusKit.getTypeByCode(portal.status);

        this.ctrl.root_.querySelector('.mdc-dialog__title').innerHTML = portal.title;
        this.ctrl.root_.querySelector('img').src = Toolkit.getImageUrl(portal.image);
        this.textConfirmedTime.innerHTML = Toolkit.getDateTimeString(portal.confirmedTime);

        this.fieldResultTime.root_.hidden = (type === 'pending');
        const resultTimeString = Toolkit.getLocalDateTimeISOString(
            portal.resultTime ? portal.resultTime : Date.now()
        );
        this.fieldResultTime.value = resultTimeString.slice(0, resultTimeString.lastIndexOf(':'));

        this.selectReason.root_.hidden = !(type === 'rejected');
        if (type === 'rejected') {
            this.selectReason.selectedIndex = portal.status - StatusKit.types.get(type).code;
        }
        if (type === 'pending') {
            Service.bs.query(portal.id, (data) => {
                const timeString = Toolkit.getLocalDateTimeISOString(data.lastTime);
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
        this.map.ctrl.setStyle(MapStyle[Dark.enabled ? 'dark' : 'default']);
    }
}

export default DetailsDialog;
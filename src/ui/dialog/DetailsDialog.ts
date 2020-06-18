import mapboxgl from 'mapbox-gl';
import { formField, radio, ripple, select, textField } from "material-components-web";

import AlertDialog from './AlertDialog';
import DialogPrototype, { dialog } from './DialogPrototype';
import Nomination, { LngLat } from '../../service/Nomination';
import StatusKit from '../../service/StatusKit';
import UIKitPrototype, { Eli, i18next } from '../UIKitPrototype';

interface DetailsDialogMapEvents {
    queryLngLat: (bsId: string, succeed: (lngLat: LngLat) => void, failed: () => void) => void;
}

class DetailsDialogMap extends UIKitPrototype {

    ctrl: mapboxgl.Map = null;
    marker: mapboxgl.Marker = null;
    dialog: dialog.MDCDialog = null;
    nomination: Nomination = null;
    buttons = {
        edit: {
            root: null as HTMLButtonElement,
            icon: '\uf044',
            clicked: () => this.edit(),
        },
        search: {
            root: null as HTMLButtonElement,
            icon: '\uf002',
            clicked: () => this.search(),
        },
        delete: {
            root: null as HTMLButtonElement,
            icon: '\uf1f8',
            clicked: () => this.delete(),
        },
    };

    events: DetailsDialogMapEvents = {
        queryLngLat : () => { },
    };

    init(parent: HTMLElement) {
        super.init(parent);
        this.render();
    }

    render() {
        const mapButtons = [];
        for (const value of Object.values(this.buttons)) {
            value.root = Eli.build('button', {
                className: 'far mdc-icon-button',
                innerHTML: value.icon,
            });
            const ctrl = new ripple.MDCRipple(value.root);
            ctrl.unbounded = true;
            ctrl.listen('click', value.clicked);
            mapButtons.push(value.root);
        }
        const elementMap = Eli.build('div', {
            className: 'flex-grow--1',
            cssTest: 'min-height: 180px',
        });

        const elementContent = Eli.build('div', {
            className: 'flex-box-row--nowrap margin-v--8',
        }, [
            Eli.build('div', {
                className: 'flex-box-col flex-justify-content--around',
            }, mapButtons),
            elementMap,
        ]);

        this.parent.append(elementContent);

        this.ctrl = new mapboxgl.Map({
            container: elementMap,
            style: `mapbox:${getComputedStyle(document.documentElement).getPropertyValue('--map-style').trim()}`,
        });
        this.ctrl.addControl(new mapboxgl.NavigationControl());
    }

    set(nomination: Nomination) {
        this.nomination = nomination;
        this.delete();
        if (this.nomination.lngLat) {
            this.marker = new mapboxgl.Marker();
            this.marker.setLngLat(this.nomination.lngLat).addTo(this.ctrl);
            this.ctrl.jumpTo({ center: this.nomination.lngLat, zoom: 16 });
            this.buttons.delete.root.disabled = false;
            this.buttons.edit.root.innerHTML = '\uf044';
        }
        this.buttons.search.root.disabled = false;
    }

    edit() {
        if (!this.marker) {
            this.marker = new mapboxgl.Marker()
                .setLngLat(this.ctrl.getCenter())
                .setDraggable(true)
                .addTo(this.ctrl);
            this.buttons.delete.root.disabled = false;
            this.buttons.edit.root.innerHTML = '\uf044';
        } else {
            this.marker.setDraggable(true);
        }
    }

    search() {
        const succeed = (lngLat: LngLat) => {
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
            this.buttons.edit.root.innerHTML = '\uf044';
            this.buttons.search.root.disabled = false;
            this.buttons.delete.root.disabled = false;
        };
        const failed = () => {
            if (!this.dialog.isOpen) return;
            AlertDialog.open(i18next.t('message:Unable to query the location.'));
            this.buttons.search.root.disabled = false;
        }
        this.buttons.search.root.disabled = true;
        this.events.queryLngLat(this.nomination.id, succeed, failed);
    }

    delete() {
        if (this.marker) this.marker.remove();
        this.marker = null;
        this.buttons.edit.root.innerHTML = '\uf067';
        this.buttons.delete.root.disabled = true;
    }
}

interface DetailsDialogEvents {
    update: (nomination: Nomination) => void;
    query: (bsId: string, succeed: (data: any) => void, failed: () => void) => void;
}

class DetailsDialog extends DialogPrototype {

    nomination: Nomination = null;

    headingTitle: HTMLHeadingElement = null;
    image: HTMLImageElement = null;
    textConfirmedTime: HTMLSpanElement = null;

    status = new Map<string, radio.MDCRadio>();
    selectedStatus: string = null;
    fieldResultTime: textField.MDCTextField = null;
    selectReason: select.MDCSelect = null;
    elementReason: HTMLDivElement = null;

    map = new DetailsDialogMap();

    events: DetailsDialogEvents = {
        update      : () => { },
        query       : () => { },
    };

    render() {
        this.headingTitle = Eli.build('h2', {
            className: 'mdc-dialog__title',
            dataset: { mdcDialogInitialFocus: '' },
            innerHTML: '',
        });

        this.image = Eli.build('img', {
            cssTest: [
                'object-fit:cover', 'object-position:center',
                'width:100%', 'height:150px;'
            ].join(';')
        });

        this.textConfirmedTime = Eli.build('span', {
            className: 'margin-l--4'
        });

        const statusRadios: Array<HTMLDivElement> = [];
        for (const key of StatusKit.types.keys()) {
            const radioId = `radio-dialog-details-status-${key}`;

            const inputRadio = Eli.build('input', {
                type: 'radio',
                className: 'mdc-radio__native-control',
                name: 'radio-dialog-details-status',
                value: key,
            });
            inputRadio.addEventListener('change', (event: Event) => {
                const target = event.target as HTMLInputElement;
                this.selectedStatus = target.value;
                this.fieldResultTime.root_.hidden = (target.value === 'pending');
                this.fieldResultTime.layout();
                this.elementReason.hidden = !(target.value === 'rejected');
                this.selectReason.layout();
                this.map.ctrl.resize();
            });
            const elementRadio = Eli.build('div', {
                className: 'mdc-radio',
            }, [
                inputRadio,
                Eli.build('div', {
                    className: 'mdc-radio__background',
                }, [
                    Eli.build('div', { className: 'mdc-radio__outer-circle' }),
                    Eli.build('div', { className: 'mdc-radio__inner-circle' }),
                ]),
            ]);
            const elementField = Eli.build('div', {
                className: 'mdc-form-field',
            }, [
                elementRadio,
                Eli.build('label', {
                    for: radioId,
                    className: `far status-${key}`,
                    innerHTML: StatusKit.types.get(key).icon,
                }),
            ]);

            const radioCtrl = new radio.MDCRadio(elementRadio);
            this.status.set(key, radioCtrl);
            const field = new formField.MDCFormField(elementField);
            field.input = radioCtrl;
            statusRadios.push(elementField);
        }

        const elementResultTime = Eli.build('div', {
            className: [
                'mdc-text-field',
                'mdc-text-field--outlined',
                'mdc-text-field--with-leading-icon',
                'margin-v--8',
                'margin-h--4',
                'flex-grow--1'
            ].join(' '),
        }, [
            Eli.build('i', {
                className: [
                    'fa',
                    'mdc-text-field__icon',
                    'mdc-text-field__icon--leading'
                ].join(' '),
                innerHTML: '\uf073',
            }),
            Eli.build('input', {
                type: 'datetime-local',
                className: 'mdc-text-field__input',
                id: 'input-dialog-details-result-time',
            }),
            Eli.notchedOutline({
                for: 'input-dialog-details-result-time',
                innerHTML: i18next.t('Result Time'),
            }),
        ]);
        this.fieldResultTime = new textField.MDCTextField(elementResultTime);

        const itemsSelectReason = [];
        for (const [key, value] of StatusKit.reasons.entries()) {
            itemsSelectReason.push(Eli.build('li', {
                className: 'mdc-list-item',
                dataset: { value: key },
                innerHTML: i18next.t(value.title),
            }));
        }
        this.elementReason = Eli.build('div', {
            className: [
                'mdc-select',
                'mdc-select--outlined',
                'margin-v--8',
                'margin-h--4'
            ].join(' '),
        }, [
            Eli.build('div', {
                className: 'mdc-select__anchor',
            }, [
                Eli.build('i', { className: 'mdc-select__dropdown-icon' }),
                Eli.build('div', { className: 'mdc-select__selected-text' }),
                Eli.notchedOutline({ innerHTML: i18next.t('Reason') }),
            ]),
            Eli.build('div', {
                className: 'mdc-select__menu mdc-menu mdc-menu-surface',
            }, [
                Eli.build('ul', {
                    className: 'mdc-list'
                }, itemsSelectReason),
            ]),
        ]);
        this.selectReason = new select.MDCSelect(this.elementReason);
        this.selectReason.selectedIndex = 0;

        const elementContents = Eli.build('div', {
            className: 'mdc-dialog__content',
        }, [
            Eli.build('div', {
                className: [
                    'mdc-typography--body1',
                    'flex-box-row--nowrap',
                    'flex-align-items--center'
                ].join(' '),
            }, [
                Eli.icon('&#xf062'), this.textConfirmedTime,
            ]),
            Eli.build('div', {
                className: [
                    'fullwidth',
                    'flex-box-row--nowrap',
                    'flex-justify-content--around'
                ].join(' '),
            }, statusRadios),
            Eli.build('div', {
                className: 'flex-box-row--wrap',
            }, [ elementResultTime, this.elementReason ]),
        ]);
        this.map.init(elementContents);
        const elementDialog = Eli.dialog([
            this.headingTitle,
            this.image,
            elementContents,
            Eli.build('footer', {
                className: 'mdc-dialog__actions',
            }, [
                Eli.dialogAction('close', 'Close'),
                Eli.dialogAction('save' , 'Save' ),
            ]),
        ]);
        this.parent.append(elementDialog);
        this.ctrl = new dialog.MDCDialog(elementDialog);
        this.ctrl.listen('MDCDialog:opened', () => this.opened());
        this.ctrl.listen('MDCDialog:closed', (event: CustomEvent) => this.closed(event));
        this.map.dialog = this.ctrl;
    }

    opened() {
        this.fieldResultTime.layout();
        this.selectReason.layout();
        this.map.ctrl.resize();
    }

    closed(event: CustomEvent) {
        if (event.detail.action !== 'save') return;
        const keys = {
            type: StatusKit.getTypeByCode(this.nomination.status.code),
            reason: StatusKit.getReasonByCode(this.nomination.status.code),
        }
        const selectedStatus = this.selectedStatus;
        let shouldUpdate = false;
        if (selectedStatus !== 'pending') {
            const time = Date.parse(this.fieldResultTime.value);
            if (!time) {
                AlertDialog.open(i18next.t('message:Invalid DateTime.'));
                return;
            }
            const newTime = time + (new Date().getTimezoneOffset() * 60000);
            if (!this.nomination.resultTime || (Math.floor(this.nomination.resultTime / 60000) !== Math.floor(newTime / 60000))) {
                this.nomination.resultTime = newTime;
                shouldUpdate = true;
            }
        }
        const reason = this.selectReason.value;
        if (selectedStatus !== keys.type) {
            shouldUpdate = true;
        } else if ((keys.type === 'rejected') && (keys.reason.key !== reason)) {
            shouldUpdate = true;
        }
        if (this.map.marker) {
            const lngLat = this.map.marker.getLngLat();
            if (!this.nomination.lngLat
                || (this.nomination.lngLat.lng !== lngLat.lng || this.nomination.lngLat.lat !== lngLat.lat)
            ) {
                this.nomination.lngLat = lngLat;
                shouldUpdate = true;
            }
        } else if (this.nomination.lngLat) {
            this.nomination.lngLat = null;
            shouldUpdate = true;
        }
        if (shouldUpdate) {
            if (this.selectedStatus !== 'rejected') {
                this.nomination.status = StatusKit.types.get(this.selectedStatus);
            } else {
                this.nomination.status = StatusKit.reasons.get(this.selectReason.value);
            }
            this.events.update(this.nomination);
        }
    }

    open(nomination: Nomination) {
        if (!this.ctrl) this.render();
        this.nomination = nomination;
        this.map.set(nomination);
        const type = StatusKit.getTypeByCode(nomination.status.code);

        this.headingTitle.innerHTML = nomination.title;
        this.image.src = nomination.imageUrl;
        this.textConfirmedTime.innerHTML = new Date(nomination.confirmedTime).toLocaleString();

        this.fieldResultTime.root_.hidden = (type === 'pending');
        const getLocalDateTimeISOString = (time: number) => {
            const date = new Date();
            date.setTime(time - date.getTimezoneOffset() * 60000);
            return date.toISOString();
        }
        const resultTimeString = getLocalDateTimeISOString(
            nomination.resultTime ? nomination.resultTime : Date.now()
        );
        this.fieldResultTime.value = resultTimeString.slice(0, resultTimeString.lastIndexOf(':'));

        this.elementReason.hidden = !(type === 'rejected');
        if (type === 'rejected') {
            this.selectReason.selectedIndex = nomination.status.code - StatusKit.types.get(type).code;
        }
        if (type === 'pending') {
            this.events.query(nomination.id, (data) => {
                const timeString = getLocalDateTimeISOString(data.lastTime);
                this.fieldResultTime.value = timeString.slice(0, timeString.lastIndexOf(':'));
                this.fieldResultTime.layout();
            }, () => {});
        }

        this.status.get(type).checked = true;
        this.selectedStatus = type;

        this.ctrl.open();
    }

    updateStyle() {
        if (!this.map.ctrl) return;
        this.map.ctrl.setStyle(`mapbox:${getComputedStyle(document.documentElement).getPropertyValue('--map-style').trim()}`);
    }
}

export default DetailsDialog;
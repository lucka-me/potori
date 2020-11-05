import i18next from 'i18next';
import { MDCChipSet } from '@material/chips';
import { MDCDialog } from '@material/dialog';
import { MDCFormField } from '@material/form-field';
import { MDCRadio } from '@material/radio';
import { MDCRipple } from '@material/ripple';
import { MDCTextField } from '@material/textfield';

import { eli } from 'ui/eli';
import { service } from 'service';
import DialogPrototype from 'ui/dialog/base';
import Nomination from 'service/nomination';
import { QueryFailReason } from 'service/brainstorming';

import './style.scss';

import { Action, ClassName, Icon, StringKey } from './constants';
import DetailsDialogMap from './map';

type MessageCallback = (message: string) => void;
type QuerySucceedCallback = (data: any) => void;
type QueryFailCallback = (reason: QueryFailReason) => void;
type QueryCallback = (nomination: Nomination, succeed: QuerySucceedCallback, failed: QueryFailCallback) => void;
type UpdateCallback = (nomination: Nomination) => void;

interface DetailsDialogEvents {
    alert: MessageCallback;
    query: QueryCallback;
    update: UpdateCallback;
}

class DetailsDialog extends DialogPrototype {

    nomination: Nomination = null;

    private textConfirmedTime: HTMLSpanElement = null;

    private status = new Map<string, MDCRadio>();
    private selectedStatus: string = null;
    private fieldResultTime: MDCTextField = null;

    private blockReason: HTMLDivElement = null;
    private fieldReason: MDCTextField = null;
    private chipSetReason: MDCChipSet = null;

    private map = new DetailsDialogMap();

    events: DetailsDialogEvents = {
        alert       : () => { },
        query       : () => { },
        update      : () => { },
    };

    render() {
        // Dialog content
        const elementContents = eli.build('div', {
            className: 'mdc-dialog__content',
        });

        // Confirmed time
        this.textConfirmedTime = eli.build('span', { });
        elementContents.append(eli.build('div', { className: 'confirmed-time' }, [
            eli.icon(Icon.arrowUp), this.textConfirmedTime
        ]));

        // Status form
        const statusRadios: Array<HTMLDivElement> = [];
        for (const key of service.status.types.keys()) {
            const radioId = `radio-dialog-details-status-${key}`;

            const inputRadio = eli.build('input', {
                type: 'radio',
                className: 'mdc-radio__native-control',
                name: 'radio-dialog-details-status',
                value: key,
            });
            inputRadio.addEventListener('change', (event: Event) => {
                const target = event.target as HTMLInputElement;
                this.selectedStatus = target.value;
                (this.fieldResultTime.root as HTMLElement).hidden = (target.value === 'pending');
                this.fieldResultTime.layout();
                this.blockReason.hidden = !(target.value === 'rejected');
                this.map.layout();
            });
            const elementRadio = eli.build('div', {
                className: 'mdc-radio',
            }, [
                inputRadio,
                eli.build('div', {
                    className: 'mdc-radio__background',
                }, [
                    eli.build('div', { className: 'mdc-radio__outer-circle' }),
                    eli.build('div', { className: 'mdc-radio__inner-circle' }),
                ]),
            ]);
            const elementField = eli.build('div', {
                className: 'mdc-form-field',
            }, [
                elementRadio,
                eli.build('label', {
                    for: radioId,
                    className: `fa status-${key}`,
                    innerHTML: service.status.types.get(key).icon,
                }),
            ]);

            const radioCtrl = new MDCRadio(elementRadio);
            this.status.set(key, radioCtrl);
            const field = new MDCFormField(elementField);
            field.input = radioCtrl;
            statusRadios.push(elementField);
        }
        elementContents.append(eli.build('div', { className: 'status-form' }, statusRadios));

        // Result time
        const elementResultTime = DetailsDialog.buildTextField(
            'result-time', Icon.calendarAlt, i18next.t(StringKey.resultTime), 'datetime-local'
        );
        elementContents.append(elementResultTime);
        this.fieldResultTime = new MDCTextField(elementResultTime);

        // Reason block
        // Text field
        const elementReason = DetailsDialog.buildTextField(
            '', '', i18next.t(StringKey.reason), 'text'
        );
        this.fieldReason = new MDCTextField(elementReason);
        this.fieldReason.disabled = true
        // Chip set
        const elementChipsReason: Array<HTMLDivElement> = [];
        for (const [key, value] of service.status.reasons.entries()) {
            elementChipsReason.push(eli.build('div', {
                className: 'mdc-chip',
                id: `details-reason-${key}`,
                role: 'row',
            }, [
                eli.build('div', { className: 'mdc-chip__ripple' }),
                eli.build('span', { role: 'gridcell' }, [
                    eli.build('span', {
                        className: 'mdc-chip__primary-action',
                        role: 'button'
                    }, [
                        eli.build('span', {
                            className: 'mdc-chip__text',
                            innerHTML: i18next.t(value.title),
                        })
                    ])
                ])
            ]));
        }
        const elementChipSetReason = eli.build('div', {
            className: 'mdc-chip-set mdc-chip-set--choice',
            role: 'grid',
            hidden: true
        }, elementChipsReason);
        this.chipSetReason = new MDCChipSet(elementChipSetReason);
        // Button
        const elementReasonExpand = eli.build('button', {
            className: 'fa mdc-icon-button',
            innerHTML: Icon.angleDown,
        });
        const rippleReasonExpand = new MDCRipple(elementReasonExpand);
        rippleReasonExpand.unbounded = true;
        rippleReasonExpand.listen('click', () => {
            elementChipSetReason.hidden = !elementChipSetReason.hidden;
            elementReasonExpand.innerHTML = elementChipSetReason.hidden ? Icon.angleDown : Icon.angleUp;
            this.map.layout();
        });
        this.blockReason = eli.build('div', {
            className: 'reason-selector'
        }, [
            eli.build('div', {
                className: 'controller'
            }, [
                elementReason,
                elementReasonExpand,
            ]),
            elementChipSetReason
        ]);
        for (const chip of this.chipSetReason.chips) {
            chip.listen('MDCChip:selection', () => {
                const key = this.chipSetReason.selectedChipIds.length > 0 ? this.chipSetReason.selectedChipIds[0].replace('details-reason-', '') : 'undeclared';
                const reason = service.status.reasons.get(key);
                this.fieldReason.leadingIconContent = reason.icon;
                this.fieldReason.value = i18next.t(reason.title);
            });
        }
        elementContents.append(this.blockReason);

        // Map
        this.map.init(elementContents);
        this.map.events.alert = (message) => this.events.alert(message);
        this.map.events.queryLngLat = (succeed, failed) => {
            this.events.query(this.nomination, (data) => {
                succeed({
                    lng: parseFloat(data.lng),
                    lat: parseFloat(data.lat)
                });
            }, failed);
        };
        const elementDialog = DialogPrototype.buildDialog('details-dialog', [
            eli.build('h2', {
                className: 'mdc-dialog__title',
                dataset: { mdcDialogInitialFocus: '' },
                innerHTML: '',
            }),
            eli.build('img', { }),
            elementContents,
            eli.build('footer', {
                className: 'mdc-dialog__actions',
            }, [
                DialogPrototype.buildDialogAction(Action.close, i18next.t('ui.dialog.close')),
                DialogPrototype.buildDialogAction(Action.save , i18next.t(StringKey.save) ),
            ]),
        ]);
        this.parent.append(elementDialog);
        this.ctrl = new MDCDialog(elementDialog);
        this.ctrl.listen('MDCDialog:opened', () => this.opened());
        this.ctrl.listen('MDCDialog:closed', (event: CustomEvent) => this.closed(event));
        rippleReasonExpand.layout();
    }

    opened() {
        this.fieldResultTime.layout();
        this.fieldReason.layout();
        this.map.layout();
        this.map.opened = true;
    }

    closed(event: CustomEvent) {
        this.map.opened = false;
        if (event.detail.action !== Action.save) return;
        const keys = {
            type: this.nomination.status.type,
            reason: this.nomination.status.code < 100 ? null : this.nomination.status,
        }
        let shouldUpdate = false;
        if (this.selectedStatus !== 'pending') {
            const time = Date.parse(this.fieldResultTime.value);
            if (!time) {
                this.events.alert(i18next.t(StringKey.messageInvalidTime));
                return;
            }
            const newTime = time + (new Date().getTimezoneOffset() * 60000);
            if (!this.nomination.resultTime || (Math.floor(this.nomination.resultTime / 60000) !== Math.floor(newTime / 60000))) {
                this.nomination.resultTime = newTime;
                shouldUpdate = true;
            }
        }
        const reason = this.chipSetReason.selectedChipIds.length > 0 ? this.chipSetReason.selectedChipIds[0].replace('details-reason-', '') : 'undeclared';
        if (this.selectedStatus !== keys.type) {
            shouldUpdate = true;
        } else if ((keys.type === 'rejected') && (keys.reason.key !== reason)) {
            shouldUpdate = true;
        }
        const lngLat = this.map.lngLat;
        if (lngLat) {
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
                this.nomination.status = service.status.types.get(this.selectedStatus);
            } else {
                this.nomination.status = service.status.reasons.get(reason);
            }
            this.events.update(this.nomination);
        }
    }

    open(nomination: Nomination) {
        if (!this.ctrl) this.render();
        this.nomination = nomination;
        this.map.lngLat = nomination.lngLat;
        const type = nomination.status.type;

        this.ctrl.root.querySelector('.mdc-dialog__title').innerHTML = nomination.title;
        this.ctrl.root.querySelector('img').src = nomination.imageUrl;
        this.textConfirmedTime.innerHTML = new Date(nomination.confirmedTime).toLocaleString();

        (this.fieldResultTime.root as HTMLElement).hidden = (type === 'pending');
        const getLocalDateTimeISOString = (time: number) => {
            const date = new Date();
            date.setTime(time - date.getTimezoneOffset() * 60000);
            return date.toISOString();
        }
        const resultTimeString = getLocalDateTimeISOString(
            nomination.resultTime ? nomination.resultTime : Date.now()
        );
        this.fieldResultTime.value = resultTimeString.slice(0, resultTimeString.lastIndexOf(':'));

        this.blockReason.hidden = !(type === 'rejected');
        if (type === 'rejected') {
            const targetId = `details-reason-${nomination.status.key}`;
            this.chipSetReason.chips.forEach((chip) => {
                chip.selected = chip.id === targetId;
            })
            this.fieldReason.leadingIconContent = nomination.status.icon;
            this.fieldReason.value = i18next.t(nomination.status.title);
        }
        if (type === 'pending') {
            this.events.query(nomination, (data) => {
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
        this.map.updateStyle();
    }

    /**
     * Build a MDC notched outline
     * @param labelOptions Options for the label element
     * @returns The outline element
     */
    static buildNotchedOutline(labelOptions: any): HTMLDivElement {
        labelOptions.className = 'mdc-floating-label';
        return eli.build('div', { className: 'mdc-notched-outline' }, [
            eli.build('div', { className: 'mdc-notched-outline__leading' }),
            eli.build('div', {
                className: 'mdc-notched-outline__notch',
            }, [ eli.build('label', labelOptions), ]),
            eli.build('div', { className: 'mdc-notched-outline__trailing' }),
        ]);
    }

    private static buildTextField(
        name: string, icon: string, label: string, type: string
    ): HTMLDivElement {
        const id = `input-dialog-details-result-time-${name}`;
        return eli.build('div', {
            className: ClassName.textField,
        }, [
            eli.build('i', {
                className: ClassName.textFieldIcon,
                innerHTML: icon,
            }),
            eli.build('input', {
                type: type,
                className: 'mdc-text-field__input',
                id: id,
            }),
            DetailsDialog.buildNotchedOutline({
                for: id,
                innerHTML: label,
            }),
        ]);
    }
}

export default DetailsDialog;
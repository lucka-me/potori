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

import DetailsDialogMap from './map';

import './style.scss';

interface DetailsDialogEvents {
    alert: (message: string) => void;
    query: (nomination: Nomination, succeed: (data: any) => void, failed: () => void) => void;
    update: (nomination: Nomination) => void;
}

class DetailsDialog extends DialogPrototype {

    nomination: Nomination = null;

    headingTitle: HTMLHeadingElement = null;
    image: HTMLImageElement = null;
    textConfirmedTime: HTMLSpanElement = null;

    status = new Map<string, MDCRadio>();
    selectedStatus: string = null;
    fieldResultTime: MDCTextField = null;

    private blockReason: HTMLDivElement = null;
    private fieldReason: MDCTextField = null;
    private chipSetReason: MDCChipSet = null;

    map = new DetailsDialogMap();

    events: DetailsDialogEvents = {
        alert       : () => { },
        query       : () => { },
        update      : () => { },
    };

    render() {
        this.headingTitle = eli.build('h2', {
            className: 'mdc-dialog__title',
            dataset: { mdcDialogInitialFocus: '' },
            innerHTML: '',
        });

        this.image = eli.build('img', {
            cssText: [
                'object-fit:cover', 'object-position:center',
                'width:100%', 'height:150px;'
            ].join(';')
        });

        this.textConfirmedTime = eli.build('span', {
            className: 'margin-l--4'
        });

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
                this.map.ctrl.resize();
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

        const elementResultTime = DetailsDialog.buildTextField(
            'input-dialog-details-result-time',
            'fullwidth',
            '\uf073',
            i18next.t('Result Time'),
            'datetime-local'
        );
        
        this.fieldResultTime = new MDCTextField(elementResultTime);

        // Reason block
        // Text field
        const elementReason = DetailsDialog.buildTextField(
            'input-dialog-details-reason',
            'flex--1',
            '',
            i18next.t('Reason'),
            'text'
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
            className: 'fa mdc-icon-button margin-l--8',
            innerHTML: '&#xf107',
        });
        const rippleReasonExpand = new MDCRipple(elementReasonExpand);
        rippleReasonExpand.unbounded = true;
        rippleReasonExpand.listen('click', () => {
            elementChipSetReason.hidden = !elementChipSetReason.hidden;
            elementReasonExpand.innerHTML = elementChipSetReason.hidden ? '&#xf107' : '&#xf106';
            this.map.ctrl.resize();
        });
        this.blockReason = eli.build('div', {
            className: 'fullwidth'
        }, [
            eli.build('div', {
                className: 'fullwidth flex-box-row--nowrap flex-align-items--center'
            }, [
                elementReason,
                elementReasonExpand,
            ]),
            elementChipSetReason
        ]);
        this.chipSetReason.chips.forEach((chip) => {
            chip.listen('MDCChip:selection', () => {
                const key = this.chipSetReason.selectedChipIds.length > 0 ? this.chipSetReason.selectedChipIds[0].replace('details-reason-', '') : 'undeclared';
                const reason = service.status.reasons.get(key);
                this.fieldReason.leadingIconContent = reason.icon;
                this.fieldReason.value = i18next.t(reason.title);
            });
        });

        // Dialog content
        const elementContents = eli.build('div', {
            className: 'mdc-dialog__content',
        }, [
            eli.build('div', {
                className: [
                    'mdc-typography--body1',
                    'flex-box-row--nowrap',
                    'flex-align-items--center'
                ].join(' '),
            }, [
                eli.icon('&#xf062'), this.textConfirmedTime,
            ]),
            eli.build('div', {
                className: [
                    'fullwidth',
                    'flex-box-row--nowrap',
                    'flex-justify-content--around'
                ].join(' '),
            }, statusRadios),
            elementResultTime,
            this.blockReason
        ]);
        this.map.init(elementContents);
        const elementDialog = DialogPrototype.buildDialog([
            this.headingTitle,
            this.image,
            elementContents,
            eli.build('footer', {
                className: 'mdc-dialog__actions',
            }, [
                DialogPrototype.buildDialogAction('close', i18next.t('Close')),
                DialogPrototype.buildDialogAction('save' , i18next.t('Save') ),
            ]),
        ]);
        this.parent.append(elementDialog);
        this.ctrl = new MDCDialog(elementDialog);
        this.ctrl.listen('MDCDialog:opened', () => this.opened());
        this.ctrl.listen('MDCDialog:closed', (event: CustomEvent) => this.closed(event));
        this.map.dialog = this.ctrl;
        rippleReasonExpand.layout();
    }

    opened() {
        this.fieldResultTime.layout();
        this.fieldReason.layout();
        this.map.ctrl.resize();
    }

    closed(event: CustomEvent) {
        if (event.detail.action !== 'save') return;
        const keys = {
            type: service.status.getTypeByCode(this.nomination.status.code),
            reason: service.status.getReasonByCode(this.nomination.status.code),
        }
        const selectedStatus = this.selectedStatus;
        let shouldUpdate = false;
        if (selectedStatus !== 'pending') {
            const time = Date.parse(this.fieldResultTime.value);
            if (!time) {
                this.events.alert(i18next.t('message:ui.dialog.details.invalidTime'));
                return;
            }
            const newTime = time + (new Date().getTimezoneOffset() * 60000);
            if (!this.nomination.resultTime || (Math.floor(this.nomination.resultTime / 60000) !== Math.floor(newTime / 60000))) {
                this.nomination.resultTime = newTime;
                shouldUpdate = true;
            }
        }
        const reason = this.chipSetReason.selectedChipIds.length > 0 ? this.chipSetReason.selectedChipIds[0].replace('details-reason-', '') : 'undeclared';
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
        this.map.set(nomination);
        const type = service.status.getTypeByCode(nomination.status.code);

        this.headingTitle.innerHTML = nomination.title;
        this.image.src = nomination.imageUrl;
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

    static buildTextField(
        id: string, extraClassName: string, icon: string, label: string, type: string
    ): HTMLDivElement {
        return eli.build('div', {
            className: [
                'mdc-text-field',
                'mdc-text-field--outlined',
                'mdc-text-field--with-leading-icon',
                'margin-v--8',
                extraClassName,
            ].join(' '),
        }, [
            eli.build('i', {
                className: [
                    'fa',
                    'mdc-text-field__icon',
                    'mdc-text-field__icon--leading'
                ].join(' '),
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
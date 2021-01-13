import i18next from 'i18next';
import { eli } from '@lucka-labs/eli';
import { MDCChipSet } from '@material/chips';
import { MDCDialog } from '@material/dialog';
import { MDCFormField } from '@material/form-field';
import { MDCRadio } from '@material/radio';
import { MDCRipple } from '@material/ripple';
import { MDCTextField } from '@material/textfield';

import { eliChipSet } from 'eli/chip';
import { eliDialog } from 'eli/dialog';
import { eliIcon } from 'eli/icon';
import { eliIconButton } from 'eli/icon-button';
import { eliRadio } from 'eli/radio';
import { eliTextField } from 'eli/text-field';

import { base } from 'ui/dialog/base';
import { umi } from 'service/umi';
import Nomination from 'service/nomination';
import { QueryFailReason } from 'service/brainstorming';

import './style.scss';

import { Action, StringKey } from './constants';
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

class DetailsDialog extends base.DialogPrototype {

    private _nomination: Nomination = null;

    private textConfirmedTime: HTMLSpanElement = null;

    private radioStatus = new Map<umi.StatusCode, MDCRadio>();
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
        const contents = [];

        // Confirmed time
        this.textConfirmedTime = eli('span', { });
        contents.push(eli('div', { className: 'confirmed-time' }, [
            eliIcon(eliIcon.Icon.arrowUp), this.textConfirmedTime
        ]));

        // Status form
        const statusRadios: Array<HTMLDivElement> = [];
        for (const [code, status] of umi.status) {
            const radioId = `radio-dialog-details-status-${code}`;
            const elementRadio = eliRadio(radioId, 'radio-dialog-details-status', `${code}`, (value) => {
                (this.fieldResultTime.root as HTMLElement).hidden = (value === 'pending');
                this.fieldResultTime.layout();
                this.blockReason.hidden = !(value === 'rejected');
                this.map.layout();
            });
            const elementField = eliRadio.form(
                elementRadio,
                status.icon, radioId, `fa status-${status.code}`
            );

            const radioCtrl = new MDCRadio(elementRadio);
            this.radioStatus.set(code, radioCtrl);
            const field = new MDCFormField(elementField);
            field.input = radioCtrl;
            statusRadios.push(elementField);
        }
        contents.push(eli('div', { className: 'status-form' }, statusRadios));

        // Result time
        const elementResultTime = eliTextField({
            id: 'input-dialog-details-result-time',
            label: i18next.t(StringKey.resultTime),
            icon: eliIcon.Icon.calendarAlt,
            inputType: 'datetime-local'
        });
        elementResultTime.classList.add('result-time');
        contents.push(elementResultTime);

        // Reason block
        // Text field
        const elementReason = eliTextField({
            id: 'input-dialog-details-reason',
            label: i18next.t(StringKey.reason),
            icon: ' ',
            inputType: 'text'
        });
        // Chip set
        const chipItems = [];
        for (const [code, reason] of umi.reason) {
            chipItems.push(
                { id: `details-reason-${code}`, text: i18next.t(reason.title) }
            );
        }
        const elementChipSetReason = eliChipSet(chipItems);
        this.chipSetReason = new MDCChipSet(elementChipSetReason);
        // Button
        const elementReasonExpand = eliIconButton(eliIcon.Icon.angleDown);
        const rippleReasonExpand = new MDCRipple(elementReasonExpand);
        rippleReasonExpand.unbounded = true;
        rippleReasonExpand.listen('click', () => {
            elementChipSetReason.hidden = !elementChipSetReason.hidden;
            elementReasonExpand.innerHTML = elementChipSetReason.hidden ? eliIcon.Icon.angleDown : eliIcon.Icon.angleUp;
            this.map.layout();
        });
        this.blockReason = eli('div', {
            className: 'reason-selector'
        }, [
            eli('div', { className: 'controller' }, [ elementReason, elementReasonExpand ]),
            elementChipSetReason
        ]);
        // for (const chip of this.chipSetReason.chips) {
        //     chip.listen('MDCChip:selection', () => {
        //         const key = this.chipSetReason.selectedChipIds.length > 0 ? this.chipSetReason.selectedChipIds[0].replace('details-reason-', '') : 'undeclared';
        //         const reason = umi.reason.get(key);
        //         this.fieldReason.leadingIconContent = reason.icon;
        //         this.fieldReason.value = i18next.t(reason.title);
        //     });
        // }
        contents.push(this.blockReason);
        
        const elementDialog = eliDialog('details-dialog', {
            title: ' ',
            contents: contents,
            actions: [
                { action: base.Action.close, text: i18next.t(base.StringKey.close) },
                { action: Action.save, text: i18next.t(StringKey.save) },
            ]
        });

        this.parent.append(elementDialog);
        const elementContent = elementDialog.querySelector('.mdc-dialog__content') as HTMLElement;
        elementDialog
            .querySelector('.mdc-dialog__surface')
            .insertBefore(eli('img', { }), elementContent);
        // Map
        this.map.init(elementContent);
        this.map.events.alert = (message) => this.events.alert(message);
        this.map.events.queryLngLat = (succeed, failed) => {
            this.events.query(
                this._nomination,
                (data) => succeed({
                    lng: parseFloat(data.lng), lat: parseFloat(data.lat)
                }),
                failed
            );
        };

        this.fieldResultTime = new MDCTextField(elementResultTime);
        this.fieldReason = new MDCTextField(elementReason);
        this.fieldReason.disabled = true

        this.ctrl = new MDCDialog(elementDialog);
        this.ctrl.listen('MDCDialog:opened', () => this.opened());
        this.ctrl.listen('MDCDialog:closed', (event: CustomEvent) => this.closed(event));
        rippleReasonExpand.layout();
    }

    updateStyle() {
        this.map.updateStyle();
    }

    set nomination(nomination: Nomination) {
        if (!this.ctrl) this.render();
        this._nomination = nomination;
        this.map.lngLat = nomination.lngLat;
        //const type = nomination.status > 100 ? 'rejected' : nomination.status > 0 ? 'accepted' : 'pending';

        this.ctrl.root.querySelector('.mdc-dialog__title').innerHTML = nomination.title;
        this.ctrl.root.querySelector('img').src = nomination.imageUrl;
        this.textConfirmedTime.innerHTML = new Date(nomination.confirmedTime).toLocaleString();

        (this.fieldResultTime.root as HTMLElement).hidden = (nomination.status === umi.StatusCode.Pending);
        const getLocalDateTimeISOString = (time: number) => {
            const date = new Date();
            date.setTime(time - date.getTimezoneOffset() * 60000);
            return date.toISOString();
        }
        const resultTimeString = getLocalDateTimeISOString(
            nomination.resultTime ? nomination.resultTime : Date.now()
        );
        this.fieldResultTime.value = resultTimeString.slice(0, resultTimeString.lastIndexOf(':'));

        this.blockReason.hidden = !(nomination.status === umi.StatusCode.Rejected);
        if (nomination.status === umi.StatusCode.Rejected) {
            if (nomination.reasons.length > 0) {
                const selectedIds = nomination.reasons.map((code) => `details-reason-${code}`);
                this.chipSetReason.chips.forEach((chip) => {
                    chip.selected = selectedIds.includes(chip.id);
                });
                const firstReason = nomination.reasonsData[0];
                this.fieldReason.leadingIconContent = firstReason.icon;
                this.fieldReason.value = i18next.t(firstReason.title);
            } else {
                const reason = umi.reason.get(umi.Reason.undeclared);
                const selectedId = `details-reason-${reason.code}`;
                this.chipSetReason.chips.forEach((chip) => {
                    chip.selected = chip.id === selectedId;
                });
                this.fieldReason.leadingIconContent = reason.icon;
                this.fieldReason.value = i18next.t(reason.title);
            }
        }
        if (nomination.status === umi.StatusCode.Pending) {
            this.events.query(nomination, (data) => {
                const timeString = getLocalDateTimeISOString(data.lastTime);
                this.fieldResultTime.value = timeString.slice(0, timeString.lastIndexOf(':'));
                this.fieldResultTime.layout();
            }, () => {});
        }

        this.radioStatus.get(nomination.status).checked = true;
    }

    private opened() {
        this.fieldResultTime.layout();
        this.fieldReason.layout();
        this.map.layout();
        this.map.opened = true;
    }

    private closed(event: CustomEvent) {
        this.map.opened = false;
        if (event.detail.action !== Action.save) return;
        let shouldUpdate = false;
        let selectedStatus = umi.StatusCode.Pending;
        for (const [code, radio] of this.radioStatus) {
            if (radio.checked) continue;
            selectedStatus = code;
            break;
        }
        if (selectedStatus !== umi.StatusCode.Pending) {
            const time = Date.parse(this.fieldResultTime.value);
            if (!time) {
                this.events.alert(i18next.t(StringKey.messageInvalidTime));
                return;
            }
            const newTime = time + (new Date().getTimezoneOffset() * 60000);
            if (!this._nomination.resultTime || (Math.floor(this._nomination.resultTime / 60000) !== Math.floor(newTime / 60000))) {
                this._nomination.resultTime = newTime;
                shouldUpdate = true;
            }
        }
        if (selectedStatus !== this._nomination.status) {
            shouldUpdate = true;
        }
        // } else if ((keys.type === 'rejected') && (keys.reason.key !== reason)) {
        //     shouldUpdate = true;
        // }
        const lngLat = this.map.lngLat;
        if (lngLat) {
            if (!this._nomination.lngLat
                || (this._nomination.lngLat.lng !== lngLat.lng || this._nomination.lngLat.lat !== lngLat.lat)
            ) {
                this._nomination.lngLat = lngLat;
                shouldUpdate = true;
            }
        } else if (this._nomination.lngLat) {
            this._nomination.lngLat = null;
            shouldUpdate = true;
        }
        if (shouldUpdate) {
            this._nomination.status = selectedStatus;
            this.events.update(this._nomination);
        }
    }
}

export default DetailsDialog;
import i18next from 'i18next';
import { MDCSwitch } from '@material/switch';

import { eli } from 'eli/eli';
import { eliCard } from 'eli/card';
import { service } from 'service';
import { base } from 'ui/dashboard/base';
import { Status, StatusType, StatusReason } from 'service/status';

import './style.scss';

import { StringKey } from './constants';
import { eliSwitch } from 'eli/switch';

interface FilterCardEvents {
    switchType:     (type   : Status, visible: boolean) => void,
    switchReason:   (reason : Status, visible: boolean) => void,
}

export default class FilterCard extends base.CardPrototype {

    types: Map<StatusType, MDCSwitch> = new Map();
    reasons: Map<StatusReason, MDCSwitch> = new Map();

    events: FilterCardEvents = {
        switchType:     () => { },
        switchReason:   () => { },
    }

    render() {
        const typeBox = eli('div', { className: 'type-box' });
        const reasonBox = eli('div', { className: 'reason-box' });
        this.root = eliCard('filter-card', [
            eli('div', { className: 'content' }, [
                eli('span', { className: 'title', innerHTML: i18next.t(StringKey.title) }),
                typeBox,
                eli('span', { className: 'subtitle', innerHTML: i18next.t(StringKey.rejected) }),
                reasonBox,
            ]),
        ]);
        this.setVisible(false);
        this.parent.append(this.root);

        for (const type of service.status.types.values()) {
            const switchCtrl = FilterCard.buildSwitch(typeBox, type, type.key);
            switchCtrl.listen('change', () => this.switchType(type, switchCtrl.checked));
            this.types.set(type, switchCtrl);
        }

        for (const reason of service.status.reasons.values()) {
            const switchCtrl = FilterCard.buildSwitch(reasonBox, reason, 'rejected');
            switchCtrl.listen('change', () => {
                this.switchReason(reason, switchCtrl.checked);
            });
            this.reasons.set(reason, switchCtrl);
        }
    }

    switchType(type: Status, checked: boolean) {
        if (type.code > 100) {
            for (const ctrl of this.reasons.values()) {
                ctrl.checked = checked;
            }
        }
        this.events.switchType(type, checked);
    }

    switchReason(reason: Status, checked: boolean) {
        this.events.switchReason(reason, checked);
        const statusRejected = service.status.types.get('rejected');
        if (checked && !this.types.get(statusRejected).checked) {
            this.types.get(statusRejected).checked = true;
            this.events.switchType(statusRejected, true);
        }
    }

    private getFilter(map: Map<Status, MDCSwitch>): Map<number, boolean> {
        const filter = new Map<number, boolean>();
        for (const [key, value] of map.entries()) {
            if (!value.checked) continue;
            filter.set(key.code, value.checked);
        }
        return filter;
    }

    get typeFilter(): Map<number, boolean> {
        return this.getFilter(this.types);
    }

    get reasonFilter(): Map<number, boolean> {
        return this.getFilter(this.reasons);
    }

    private static buildSwitch(parent: HTMLElement, status: Status, type: string) {
        const id = `switch-filter-${status.key}`;
        const element = eliSwitch(id);
        const box = eli('div', { }, [
            element,
            eli('label', {
                className: `fa fa-fw status-${type}`,
                for: id,
                title: i18next.t(status.title),
                innerHTML: status.icon,
            })
        ]);
        parent.append(box);
        const ctrl = new MDCSwitch(element);
        ctrl.checked = true;
        return ctrl;
    }
}
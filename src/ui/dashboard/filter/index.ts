import i18next from 'i18next';
import { MDCSwitch } from '@material/switch';

import { eli } from 'eli/eli';
import { eliCard } from 'eli/card';
import { service } from 'service';
import { base } from 'ui/dashboard/base';
import { Status, StatusType, StatusReason } from 'service/status';

import './style.scss';

import { StringKey } from './constants';

interface FilterCardBlock {
    root: HTMLDivElement;
}

interface FilterCardEvents {
    switchType:     (type   : Status, visible: boolean) => void,
    switchReason:   (reason : Status, visible: boolean) => void,
}

export default class FilterCard extends base.CardPrototype {

    block = {
        type    : { root: null } as FilterCardBlock,
        reason  : { root: null } as FilterCardBlock,
    }

    types: Map<StatusType, MDCSwitch> = new Map();
    reasons: Map<StatusReason, MDCSwitch> = new Map();

    events: FilterCardEvents = {
        switchType:     () => { },
        switchReason:   () => { },
    }

    render() {
        this.block.type.root = eli('div', { className: 'flex-box-row--nowrap' });
        this.block.reason.root = eli('div', {
            cssText: 'overflow-y: auto;',
            className: 'flex-box-row--wrap'
        });
        this.root = eliCard('filter-card', [
            eli('div', { className: 'content' }, [
                eli('span', { className: 'title', innerHTML: i18next.t(StringKey.title) }),
                eli('span', { className: 'subtitle', innerHTML: i18next.t(StringKey.type) }),
                this.block.type.root,
                eli('span', { className: 'subtitle', innerHTML: i18next.t(StringKey.rejected) }),
                this.block.reason.root,
            ]),
        ]);
        this.setVisible(false);
        this.parent.append(this.root);
        
        for (const reason of service.status.reasons.values()) {
            const switchCtrl = FilterCard.buildSwitch(this.block.reason, reason, 'rejected');
            switchCtrl.listen('change', () => {
                this.switchReason(reason, switchCtrl.checked);
            });
            this.reasons.set(reason, switchCtrl);
        }
        for (const type of service.status.types.values()) {
            const switchCtrl = FilterCard.buildSwitch(this.block.type, type, type.key);
            switchCtrl.listen('change', () => this.switchType(type, switchCtrl.checked));
            this.types.set(type, switchCtrl);
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

    private static buildSwitch(block: FilterCardBlock, status: Status, type: string) {
        const id = `switch-filter-${status.key}`;
        const element = eli('div', { className: 'mdc-switch' }, [
            eli('div', { className: 'mdc-switch__track' }),
            eli('div', {
                className: 'mdc-switch__thumb-underlay',
                id: id,
            }, [
                eli('div', { className: 'mdc-switch__thumb' }, [
                    eli('input', {
                        type: 'checkbox',
                        className: 'mdc-switch__native-control',
                        role: 'switch',
                    }),
                ]),
            ]),
        ]);
        const container = eli('div', {
            className: 'mdc-switch-box margin-h--4',
        }, [
            element,
            eli('label', {
                className: `fa fa-fw status-${type}`,
                for: id,
                title: i18next.t(status.title),
                innerHTML: status.icon,
            })
        ]);
        block.root.append(container);
        const ctrl = new MDCSwitch(element);
        ctrl.checked = true;
        return ctrl;
    }
}
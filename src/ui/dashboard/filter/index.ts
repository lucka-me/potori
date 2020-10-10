import i18next from 'i18next';
import { MDCSwitch } from '@material/switch';

import { eli } from 'ui/eli';
import { service } from 'service';
import { DashboardPrototype } from 'ui/dashboard/base';
import { Status, StatusType, StatusReason } from 'service/status';

import './style.scss';

interface FilterCardBlock {
    root: HTMLDivElement;
}

interface FilterCardEvents {
    switchType:     (type   : Status, visible: boolean) => void,
    switchReason:   (reason : Status, visible: boolean) => void,
}

export default class FilterCard extends DashboardPrototype {

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
        this.block.type.root = eli.build('div', { className: 'flex-box-row--nowrap' });
        this.block.reason.root = eli.build('div', {
            cssText: 'overflow-y: auto;',
            className: 'flex-box-row--wrap'
        });
        this.root = eli.build('div', {
            className: [
                'mdc-card',
                'mdc-card--outlined',
                'padding--8',
                'flex--2',
                'flex-shrink--0'
            ].join(' '),
            cssText: 'min-width: 250px',
        }, [
            eli.build('span', {
                className: 'mdc-typography--headline6',
                innerHTML: i18next.t('ui.dashboard.brainstorming.filter.title')
            }),
            eli.build('span', {
                className: 'mdc-typography--subtitle1',
                innerHTML: i18next.t('ui.dashboard.brainstorming.filter.type')
            }),
            this.block.type.root,
            eli.build('span', {
                className: 'mdc-typography--subtitle1',
                innerHTML: i18next.t('ui.dashboard.brainstorming.filter.rejected')
            }),
            this.block.reason.root,
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
        const element = eli.build('div', { className: 'mdc-switch' }, [
            eli.build('div', { className: 'mdc-switch__track' }),
            eli.build('div', {
                className: 'mdc-switch__thumb-underlay',
                id: id,
            }, [
                eli.build('div', { className: 'mdc-switch__thumb' }, [
                    eli.build('input', {
                        type: 'checkbox',
                        className: 'mdc-switch__native-control',
                        role: 'switch',
                    }),
                ]),
            ]),
        ]);
        const container = eli.build('div', {
            className: 'mdc-switch-box margin-h--4',
        }, [
            element,
            eli.build('label', {
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
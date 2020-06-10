import { MDCSwitch } from "@material/switch";

import { DashboardPrototype } from './prototypes';
import Eli from "../Eli";
import StatusKit, { Status } from '../../service/StatusKit';

interface FilterCardBlock {
    root: HTMLDivElement;
}

interface FilterCardEvents {
    switchType:     (type   : Status, visible: boolean) => void,
    switchReason:   (reason : Status, visible: boolean) => void,
}

class FilterCard extends DashboardPrototype {

    block = {
        type    : { root: null } as FilterCardBlock,
        reason  : { root: null } as FilterCardBlock,
    }

    types: Map<string, MDCSwitch> = new Map();
    reasons: Map<string, MDCSwitch> = new Map();

    events: FilterCardEvents = {
        switchType:     () => { },
        switchReason:   () => { },
    }

    constructor() {
        super();
    }

    init(parent: HTMLElement) {
        this.block.type.root = Eli.build('div', { className: 'flex-box-row--nowrap' }) as HTMLDivElement;
        this.block.reason.root = Eli.build('div', { className: 'flex-box-row--nowrap' }) as HTMLDivElement;
        this.root = Eli.build('div', {
            className: 'mdc-card mdc-card--outlined padding--8 flex--1 flex-shrink--0',
            children: [
                Eli.build('span', {
                    className: 'mdc-typography--headline6',
                    innerHTML: 'Filter'
                }),
                Eli.build('span', {
                    className: 'mdc-typography--subtitle1',
                    innerHTML: 'Type'
                }),
                this.block.type.root,
                Eli.build('span', {
                    className: 'mdc-typography--subtitle1',
                    innerHTML: 'Rejected'
                }),
                this.block.reason.root,
            ],
        });
        this.setVisible(false);
        parent.appendChild(this.root);
        
        for (const reason of StatusKit.reasons.values()) {
            const switchCtrl = FilterCard.buildSwitch(this.block.reason, reason, 'rejected');
            switchCtrl.listen('change', () => {
                this.switchReason(reason, switchCtrl.checked);
            });
            this.reasons.set(reason.key, switchCtrl);
        }
        for (const type of StatusKit.types.values()) {
            const switchCtrl = FilterCard.buildSwitch(this.block.type, type, type.key);
            switchCtrl.listen('change', (_) => this.switchType(type, switchCtrl.checked));
            this.types.set(type.key, switchCtrl);
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
        const statusRejected = StatusKit.types.get('rejected');
        if (checked && !this.types.get(statusRejected.key).checked) {
            this.types.get(statusRejected.key).checked = true;
            this.events.switchType(statusRejected, true);
        }
    }

    static buildSwitch(block: FilterCardBlock, status: Status, type: string) {
        const id = `switch-filter-${status.key}`;
        const element = Eli.build('div', {
            className: 'mdc-switch',
            children: [
                Eli.build('div', { className: 'mdc-switch__track' }),
                Eli.build('div', {
                    className: 'mdc-switch__thumb-underlay',
                    id: id,
                    children: [
                        Eli.build('div', {
                            className: 'mdc-switch__thumb',
                            children: [
                                Eli.build('input', {
                                    type: 'checkbox',
                                    className: 'mdc-switch__native-control',
                                    role: 'switch',
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        });
        const container = Eli.build('div', {
            className: 'mdc-switch-box margin-h--4',
            children: [
                element,
                Eli.build('label', {
                    className: `material-icons status-${type}`,
                    for: id,
                    title: status.title,
                    innerHTML: status.icon,
                })
            ],
        });
        block.root.appendChild(container);
        const ctrl = new MDCSwitch(element);
        ctrl.checked = true;
        return ctrl;
    }
}

export default new FilterCard();
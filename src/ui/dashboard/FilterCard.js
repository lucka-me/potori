import { DashboardPrototype } from './prototypes.js';
import Eli from "../Eli";
import StatusKit from '../../service/StatusKit';

class FilterCard extends DashboardPrototype {
    constructor() {
        super();
        this.block = { type: null, reason: null, };
        this.type = { };
        this.reason = { };

        this.event = {
            switchType:     (type   , visible) => { type    ; visible; },
            switchReason:   (reason , visible) => { reason  ; visible; },
        };
    }

    init(parent) {
        this.block.type = Eli.build('div', { className: 'flex-box-row--nowrap' });
        this.block.reason = Eli.build('div', { className: 'flex-box-row--nowrap' });
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
                this.block.type,
                Eli.build('span', {
                    className: 'mdc-typography--subtitle1',
                    innerHTML: 'Rejected'
                }),
                this.block.reason,
            ],
        });
        this.setVisible(false);
        parent.appendChild(this.root);

        const createSwitch = (block, key, type) => {
            const id = `switch-filter-${block}-${key}`;
            const status = (block === 'type') ? StatusKit.types.get(key) : StatusKit.reasons.get(key);
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
            this.block[block].appendChild(container);
            this[block][key] = new mdc.switchControl.MDCSwitch(element);
            this[block][key].checked = true;
            return this[block][key];
        };
        
        for (const key of StatusKit.reasons.keys()) {
            const switchCtrl = createSwitch('reason', key, 'rejected');
            switchCtrl.listen('change', (_) => {
                this.switchReason(key);
            });
        }
        for (const key of StatusKit.types.keys()) {
            const switchCtrl = createSwitch('type', key, key);
            switchCtrl.listen('change', (_) => this.switchType(key));
        }
    }

    setVisible(visible) { this.root.hidden = !visible; }

    switchType(type) {
        if (type === 'rejected') {
            for (const reason of Object.keys(this.reason)) {
                this.reason[reason].checked = this.type.rejected.checked;
            }
        }
        this.event.switchType(type, this.type[type].checked);
    }

    switchReason(reason) {
        const visible = this.reason[reason].checked;
        this.event.switchReason(reason, visible);
        if (visible && !this.type.rejected.checked) {
            this.type.rejected.checked = true;
            this.event.switchType('rejected', true);
        }
    }
}

export default new FilterCard();
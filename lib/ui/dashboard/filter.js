dashboard.filter = {
    root: null,
    block: { type: null, reason: null, },
    type: { },
    reason: { },
    init(parent) {
        this.block.type = eliKit.build('div', { className: 'flex-box-row--nowrap' });
        this.block.reason = eliKit.build('div', { className: 'flex-box-row--nowrap' });
        this.root = eliKit.build('div', {
            className: 'mdc-card mdc-card--outlined padding--8 flex--1 flex-shrink--0',
            children: [
                eliKit.build('span', {
                    className: 'mdc-typography--headline6',
                    innerHTML: 'Filter'
                }),
                eliKit.build('span', {
                    className: 'mdc-typography--subtitle1',
                    innerHTML: 'Type'
                }),
                this.block.type,
                eliKit.build('span', {
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
            const element = eliKit.build('div', {
                className: 'mdc-switch',
                children: [
                    eliKit.build('div', { className: 'mdc-switch__track' }),
                    eliKit.build('div', {
                        className: 'mdc-switch__thumb-underlay',
                        id: id,
                        children: [
                            eliKit.build('div', {
                                className: 'mdc-switch__thumb',
                                children: [
                                    eliKit.build('input', {
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
            const container = eliKit.build('div', {
                className: 'mdc-switch-box margin-h--4',
                children: [
                    element,
                    eliKit.build('label', {
                        className: `material-icons status-${type}`,
                        for: id,
                        title: value.data[block][key].title,
                        innerHTML: value.data[block][key].icon,
                    })
                ],
            });
            this.block[block].appendChild(container);
            this[block][key] = new mdc.switchControl.MDCSwitch(element);
            this[block][key].checked = true;
            return this[block][key];
        };
        for (const key of Object.keys(value.data.reason)) {
            const switchCtrl = createSwitch('reason', key, 'rejected');
            switchCtrl.listen('change', (_) => {
                this.switchRejecteReason(key);
            });
        }
        for (const key of Object.keys(value.data.type)) {
            const switchCtrl = createSwitch('type', key, key,);
            switchCtrl.listen(
                'change',
                (_) => {
                    this.switchType(key);
                    if (key === 'rejected') {
                        for (const key of Object.keys(this.reason)) {
                            this.reason[key].checked =
                            this.type.rejected.checked;
                        }
                        dashboard.map.updateRejected();
                    }
                }
            );
        }
    },
    update() { },
    updateStyle() { },
    setVisible(visible) { this.root.hidden = !visible; },
    switchType(type) {
        const filter = this.type[type];
        const hidden = !filter.checked;
        const code = value.data.type[type].code;
        for (const portal of process.portals) {
            if (toolkit.typeMatched(portal.status, code)) {
                document.getElementById(`card-${portal.id}`).hidden = hidden;
            }
        }
        dashboard.map.setTypeVisible(type, filter.checked);
    },
    switchRejecteReason(reason) {
        const filter = this.reason[reason];
        const hidden = !filter.checked;
        for (const portal of process.portals) {
            if (portal.status !== value.data.reason[reason].code) continue;
            document.getElementById(`card-${portal.id}`).hidden = hidden;
        }
        dashboard.map.updateRejected();
        if (!hidden && !this.type.rejected.checked) {
            this.type.rejected.checked = true;
            dashboard.map.setTypeVisible('rejected', true);
        }
    },
};
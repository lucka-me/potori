const dashboard = {
    map: {
    },
    filter: {
        block: {
            type:           document.getElementById('block-card-filter-type'),
            rejectedReason: document.getElementById('block-card-filter-rejectedReason'),
        },
        type: { },
        rejectedReason: { },
        init: () => {
            const createSwitch = (block, key, type, title, icon) => {
                const switchId = `switch-filter-${block}-${key}`;
                const switchBox = document.getElementById('template-switchBox').content.cloneNode(true);
                const switchElement = switchBox.querySelector('.mdc-switch');
                switchElement.id = switchId;
                const switchLabel = switchBox.querySelector('label');
                switchLabel.for = switchId;
                const labelIcon = switchLabel.querySelector('i');
                labelIcon.className += ` status-${type}`;
                labelIcon.title = title;
                labelIcon.innerHTML = icon;
                dashboard.filter.block[block].appendChild(switchBox);
                dashboard.filter[block][key] = {
                    switch: new mdc.switchControl.MDCSwitch(switchElement),
                    label: switchLabel.querySelector('span'),
                };
                return dashboard.filter[block][key].switch;
            };
            for (const key of Object.keys(value.data.rejectedReason)) {
                const switchCtrl = createSwitch(
                    'rejectedReason', key, 'rejected',
                    value.data.rejectedReason[key].title, value.data.rejectedReason[key].icon
                );
                switchCtrl.listen('change', (_) => {
                    dashboard.filter.switchRejecteReason(key);
                });
            }
            for (const key of Object.keys(value.data.type)) {
                const switchCtrl = createSwitch(
                    'type', key, key,
                    value.data.type[key].title, value.data.type[key].icon
                );
                switchCtrl.listen(
                    'change',
                    (_) => {
                        dashboard.filter.switchType(key);
                        if (key === 'rejected') {
                            for (const key of Object.keys(dashboard.filter.rejectedReason)) {
                                dashboard.filter.rejectedReason[key].switch.checked =
                                    dashboard.filter.type.rejected.switch.checked;
                            }
                            mapKit.updateRejectedData();
                        }
                    }
                );
            }
        },
        switchType: (type) => {
            const filter = dashboard.filter.type[type];
            const hidden = !filter.switch.checked;
            const code = value.data.type[type].code;
            for (const portal of process.portals) {
                if (toolkit.typeMatched(portal.status, code)) {
                    document.getElementById(`card-${portal.id}`).hidden = hidden;
                }
            }
            mapKit.setVisible(type, filter.switch.checked);
        },
        switchRejecteReason: (reason) => {
            const filter = dashboard.filter.rejectedReason[reason];
            const hidden = !filter.switch.checked;
            for (const portal of process.portals) {
                if (portal.status !== value.data.rejectedReason[reason].code) continue;
                document.getElementById(`card-${portal.id}`).hidden = hidden;
            }
            mapKit.updateRejectedData();
            if (!hidden && !dashboard.filter.type.rejected.switch.checked) {
                dashboard.filter.type.rejected.switch.checked = true;
                mapKit.setVisible('rejected', true);
            }
        },
        update: () => {
            const counter = { type: { }, rejectedReason: { } };
            for (const block of Object.keys(dashboard.filter.block)) {
                for (const key of Object.keys(dashboard.filter[block])) {
                    counter[block][key] = 0;
                }
            }
            for (const portal of process.portals) {
                const type = toolkit.getTypeByCode(portal.status);
                counter.type[type] += 1;
                if (portal.status < 101) continue;
                const reason = toolkit.getRejectedReasonByCode(portal.status);
                counter.rejectedReason[reason] += 1;
            }
            for (const key of Object.keys(dashboard.filter.type)) {
                dashboard.filter.type[key].label.innerHTML =
                    toolkit.getCountString(counter.type[key], process.portals.length);
            }
            for (const key of Object.keys(dashboard.filter.rejectedReason)) {
                dashboard.filter.rejectedReason[key].label.innerHTML =
                    toolkit.getCountString(counter.rejectedReason[key], counter.type.rejected);
            }
        },
    },
    init: () => {
        dashboard.filter.init();
    },
    hide: () => {
        document.querySelector('#card-filter').hidden = true;
    },
    show: () => {
        document.querySelector('#card-filter').hidden = false;
    }
};
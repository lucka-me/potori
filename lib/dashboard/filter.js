dashboard.card.filter = {
    block: {
        type:   document.getElementById('block-card-filter-type'),
        reason: document.getElementById('block-card-filter-reason'),
    },
    type: { },
    reason: { },
    init: () => {
        const card = dashboard.card.filter;
        const createSwitch = (block, key, type) => {
            const switchId = `switch-filter-${block}-${key}`;
            const switchBox = document.getElementById('template-switchBox').content.cloneNode(true);
            const switchElement = switchBox.querySelector('.mdc-switch');
            switchElement.id = switchId;
            const switchLabel = switchBox.querySelector('label');
            switchLabel.className = `material-icons status-${type}`;
            switchLabel.for = switchId;
            switchLabel.title = value.data[block][key].title;
            switchLabel.innerHTML = value.data[block][key].icon;
            card.block[block].appendChild(switchBox);
            card[block][key] = new mdc.switchControl.MDCSwitch(switchElement);
            return card[block][key];
        };
        for (const key of Object.keys(value.data.reason)) {
            const switchCtrl = createSwitch('reason', key, 'rejected');
            switchCtrl.listen('change', (_) => {
                card.switchRejecteReason(key);
            });
        }
        for (const key of Object.keys(value.data.type)) {
            const switchCtrl = createSwitch('type', key, key,);
            switchCtrl.listen(
                'change',
                (_) => {
                    card.switchType(key);
                    if (key === 'rejected') {
                        for (const key of Object.keys(card.reason)) {
                            card.reason[key].checked =
                            card.type.rejected.checked;
                        }
                        mapKit.updateRejectedData();
                    }
                }
            );
        }
    },
    update: () => { },
    updateStyle: () => { },
    setVisible: (visible) => document.querySelector('#card-filter').hidden = !visible,
    switchType: (type) => {
        const filter = dashboard.card.filter.type[type];
        const hidden = !filter.checked;
        const code = value.data.type[type].code;
        for (const portal of process.portals) {
            if (toolkit.typeMatched(portal.status, code)) {
                document.getElementById(`card-${portal.id}`).hidden = hidden;
            }
        }
        mapKit.setVisible(type, filter.checked);
    },
    switchRejecteReason: (reason) => {
        const filter = dashboard.card.filter.reason[reason];
        const hidden = !filter.checked;
        for (const portal of process.portals) {
            if (portal.status !== value.data.reason[reason].code) continue;
            document.getElementById(`card-${portal.id}`).hidden = hidden;
        }
        mapKit.updateRejectedData();
        if (!hidden && !dashboard.card.filter.type.rejected.checked) {
            dashboard.card.filter.type.rejected.checked = true;
            mapKit.setVisible('rejected', true);
        }
    },
};
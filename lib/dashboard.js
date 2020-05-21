const dashboard = {
    card: {
        map: {
            init: () => mapKit.load(),
            update: () => mapKit.updateData(),
            setVisible: (visible) => visible,
        },
        filter: {
            block: {
                type:           document.getElementById('block-card-filter-type'),
                rejectedReason: document.getElementById('block-card-filter-rejectedReason'),
            },
            type: { },
            rejectedReason: { },
            init: () => {
                const card = dashboard.card.filter;
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
                    card.block[block].appendChild(switchBox);
                    card[block][key] = {
                        switch: new mdc.switchControl.MDCSwitch(switchElement),
                        label: switchLabel.querySelector('span'),
                    };
                    return card[block][key].switch;
                };
                for (const key of Object.keys(value.data.rejectedReason)) {
                    const switchCtrl = createSwitch(
                        'rejectedReason', key, 'rejected',
                        value.data.rejectedReason[key].title, value.data.rejectedReason[key].icon
                    );
                    switchCtrl.listen('change', (_) => {
                        card.switchRejecteReason(key);
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
                            card.switchType(key);
                            if (key === 'rejected') {
                                for (const key of Object.keys(card.rejectedReason)) {
                                    card.rejectedReason[key].switch.checked =
                                    card.type.rejected.switch.checked;
                                }
                                mapKit.updateRejectedData();
                            }
                        }
                    );
                }
            },
            update: () => {
                const card = dashboard.card.filter;
                const counter = { type: { }, rejectedReason: { } };
                for (const block of Object.keys(card.block)) {
                    for (const key of Object.keys(card[block])) {
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
                for (const key of Object.keys(card.type)) {
                    card.type[key].label.innerHTML =
                        toolkit.getCountString(counter.type[key], process.portals.length);
                }
                for (const key of Object.keys(card.rejectedReason)) {
                    card.rejectedReason[key].label.innerHTML =
                        toolkit.getCountString(counter.rejectedReason[key], counter.type.rejected);
                }
            },
            setVisible: (visible) => document.querySelector('#card-filter').hidden = !visible,
            switchType: (type) => {
                const filter = dashboard.card.filter.type[type];
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
                const filter = dashboard.card.filter.rejectedReason[reason];
                const hidden = !filter.switch.checked;
                for (const portal of process.portals) {
                    if (portal.status !== value.data.rejectedReason[reason].code) continue;
                    document.getElementById(`card-${portal.id}`).hidden = hidden;
                }
                mapKit.updateRejectedData();
                if (!hidden && !dashboard.card.filter.type.rejected.switch.checked) {
                    dashboard.card.filter.type.rejected.switch.checked = true;
                    mapKit.setVisible('rejected', true);
                }
            },
        },
        quotas: {
            chart: null,
            init: () => {
                const context = document.querySelector('#card-quotas canvas').getContext('2d');
                const labels = [];
                for (let i = 1; i < 15; i++) {
                    labels.push(`${i}`)
                }
                dashboard.card.quotas.chart = new Chart(context, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: [],
                            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--mdc-theme-primary'),
                            borderWidth: 1,
                            fill: false,
                        }]
                    },
                    options: {
                        legend: {
                            display: false,
                        },
                        scales: {
                            yAxes: [{
                                ticks: { beginAtZero: true, }
                            }],
                            xAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Day'
                                }
                            }],
                        },
                        maintainAspectRatio: false,
                    }
                });
            },
            update: () => {
                const data = new Array(14).fill(0);
                const timeNow = Date.now();
                for (const portal of process.portals) {
                    const restoreTime = portal.confirmedTime + (14 * 24 * 3600 * 1000);
                    if (restoreTime > timeNow) {
                        data[Math.floor((restoreTime - timeNow) / (24 * 3600 * 1000))] += 1;
                    }
                }
                dashboard.card.quotas.chart.data.datasets[0].data = data;
                dashboard.card.quotas.chart.update();
            },
            setVisible: (visible) => document.querySelector('#card-quotas').hidden = !visible,
        },
    },
    init() {
        for (const card of Object.keys(dashboard.card)) {
            dashboard.card[card].init();
        }
    },
    hide: () => {
        for (const card of Object.keys(dashboard.card)) {
            dashboard.card[card].setVisible(false);
        }
    },
    show: () => {
        for (const card of Object.keys(dashboard.card)) {
            dashboard.card[card].setVisible(true);
        }
    },
    update: () => {
        for (const card of Object.keys(dashboard.card)) {
            dashboard.card[card].update();
        }
    }
};
const dashboardPrototype = {
    init: () => { },
    update: () => { },
    updateStyle: () => { },
    setVisible: (visible) => visible,
};

const dashboard = {
    card: {
        map: {
            init: () => mapKit.load(),
            update: () => mapKit.updateData(),
            updateStyle: () => { },
            setVisible: (visible) => visible,
        },
        filter:         dashboardPrototype,
        statsType:      dashboardPrototype,
        statsRejected:  dashboardPrototype,
        countMonth:     dashboardPrototype,
        quotas:         dashboardPrototype,
        bs:             dashboardPrototype,
    },
    init() {
        Chart.defaults.global.legend.labels.boxWidth = 10;
        // Fix for #6890, should remove when upgrade to 3.0
        Chart.defaults.radar.tooltips = {
            callbacks: {
                title: (items, data) => data.labels[items[0].index],
            }
        }
        for (const card of Object.keys(dashboard.card)) {
            dashboard.card[card].init();
        }
    },
    refresh: () => {
        for (const card of Object.keys(dashboard.card)) {
            dashboard.card[card].update();
        }
    },
    update: () => {
        dashboard.card.map.update();
        dashboard.card.statsType.update();
        dashboard.card.statsRejected.update();
        dashboard.card.countMonth.update();
    },
    updateStyle: () => {
        for (const card of Object.keys(dashboard.card)) {
            dashboard.card[card].updateStyle();
        }
    },
    setVisible: (visible) => {
        for (const card of Object.keys(dashboard.card)) {
            dashboard.card[card].setVisible(visible);
        }
    },
};
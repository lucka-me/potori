const dashboardCardPrototype = {
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
        filter:         dashboardCardPrototype,
        statsType:      dashboardCardPrototype,
        statsRejected:  dashboardCardPrototype,
        countMonth:     dashboardCardPrototype,
        quotas:         dashboardCardPrototype,
        bs:             dashboardCardPrototype,
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
    }
};
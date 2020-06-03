const DashboardPrototype = {
    init() { },
    update() { },
    updateStyle() { },
    setVisible(visible) { visible },
};

const dashboard = {
    card: {
        map:            DashboardPrototype,
        filter:         DashboardPrototype,
        statsType:      DashboardPrototype,
        statsRejected:  DashboardPrototype,
        countMonth:     DashboardPrototype,
        quotas:         DashboardPrototype,
        bs:             DashboardPrototype,
    },
    init() {
        Chart.defaults.global.legend.labels.boxWidth = 10;
        Chart.defaults.global.maintainAspectRatio = false;
        Chart.defaults.line.tooltips = { intersect: false, };
        // Fix for #6890, should remove when upgrade to 3.0
        Chart.defaults.radar.tooltips = {
            intersect: false,
            callbacks: {
                title: (items, data) => data.labels[items[0].index],
            }
        }
        for (const card of Object.keys(this.card)) {
            this.card[card].init();
        }
    },
    refresh() {
        for (const card of Object.keys(this.card)) {
            this.card[card].update();
        }
    },
    update() {
        this.card.map.update();
        this.card.statsType.update();
        this.card.statsRejected.update();
        this.card.countMonth.update();
    },
    updateStyle() {
        for (const card of Object.keys(this.card)) {
            this.card[card].updateStyle();
        }
    },
    setVisible(visible) {
        for (const card of Object.keys(this.card)) {
            this.card[card].setVisible(visible);
        }
        if (mapKit.ctrl) mapKit.ctrl.resize();
    },
};
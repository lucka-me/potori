const DashboardBsPrototype = {
    init() { },
    update(stats) { stats },
    updateStyle() { },
    setVisible(visible) { visible },
}

dashboard.bs = {
    card: {
        basic:      DashboardBsPrototype,
        rates:      DashboardBsPrototype,
        synch:      DashboardBsPrototype,
        reviews:    DashboardBsPrototype,
    },
    
    init(parent) {
        for (const card of Object.keys(this.card)) {
            this.card[card].init(parent);
        }
    },
    update() {
        const stats = process.analyseBs();
        for (const key of Object.keys(this.card)) {
            this.card[key].update(stats);
        }
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
    },
};
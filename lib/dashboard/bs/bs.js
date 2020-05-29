const dashboardBsPrototype = {
    init: () => { },
    update: (stats) => stats,
    updateStyle: () => { },
    setVisible: (visible) => visible,
}

dashboard.card.bs = {
    card: {
        basic:      dashboardBsPrototype,
        rates:      dashboardBsPrototype,
        synch:      dashboardBsPrototype,
        reviews:    dashboardBsPrototype,
    },
    
    init: () => {
        for (const card of Object.keys(dashboard.card.bs.card)) {
            dashboard.card.bs.card[card].init();
        }
    },
    update: () => {
        const stats = process.analyseBs();
        for (const key of Object.keys(dashboard.card.bs.card)) {
            dashboard.card.bs.card[key].update(stats);
        }
    },
    updateStyle: () => {
        for (const card of Object.keys(dashboard.card.bs.card)) {
            dashboard.card.bs.card[card].updateStyle();
        }
    },
    setVisible: (visible) => {
        for (const card of Object.keys(dashboard.card.bs.card)) {
            dashboard.card.bs.card[card].setVisible(visible);
        }
    },
};
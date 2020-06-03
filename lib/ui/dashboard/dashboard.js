const DashboardPrototype = {
    init(parent) { parent },
    update() { },
    updateStyle() { },
    setVisible(visible) { visible },
};

const dashboard = {
    map:            DashboardPrototype,
    filter:         DashboardPrototype,
    statsType:      DashboardPrototype,
    statsRejected:  DashboardPrototype,
    countMonth:     DashboardPrototype,
    quotas:         DashboardPrototype,
    bs:             DashboardPrototype,
};
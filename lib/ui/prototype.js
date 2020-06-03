class UIKitPrototype {
    constructor() { }
    init(parent) { parent }
}

class DialogPrototype extends UIKitPrototype {
    constructor() {
        super();
        this.ctrl = null;
    }
    init(parent) { parent }
    open() { }
}

class DashboardPrototype extends UIKitPrototype {
    constructor() {
        super();
        this.root = null;
    }
    init(parent) { parent }
    update() { }
    updateStyle() { }
    setVisible(visible) { this.root.hidden = !visible; }
}

class DashboardChartProtorype extends DashboardPrototype {
    constructor() {
        super();
        this.chart = null;
    }
}

class DashboardBsPrototype extends DashboardPrototype {
    constructor() { super(); }
    update(stats) { stats }
}

class DashboardBsChartPrototype extends DashboardBsPrototype {
    constructor() {
        super();
        this.chart = null;
    }
}
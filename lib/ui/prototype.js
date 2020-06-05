export class UIKitPrototype {
    constructor() { }
    init(parent) { parent }
}

export class DialogPrototype extends UIKitPrototype {
    constructor() {
        super();
        this.ctrl = null;
    }
    init(parent) { parent }
    open() { }
}

export class DashboardPrototype extends UIKitPrototype {
    constructor() {
        super();
        this.root = null;
    }
    init(parent) { parent }
    update() { }
    updateStyle() { }
    setVisible(visible) { this.root.hidden = !visible; }
}

export class DashboardChartProtorype extends DashboardPrototype {
    constructor() {
        super();
        this.chart = null;
    }
}

export class DashboardBsPrototype extends DashboardPrototype {
    constructor() { super(); }
    update(stats) { stats }
}

export class DashboardBsChartPrototype extends DashboardBsPrototype {
    constructor() {
        super();
        this.chart = null;
    }
}
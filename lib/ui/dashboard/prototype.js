import { UIKitPrototype } from "../prototype.js";

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
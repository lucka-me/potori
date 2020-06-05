import { DashboardPrototype } from "../prototype.js";

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
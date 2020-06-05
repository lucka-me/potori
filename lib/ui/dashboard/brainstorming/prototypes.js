import { DashboardPrototype } from "../prototypes.js";

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
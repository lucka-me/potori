import { DashboardPrototype } from "../prototypes";
import { BrainstormingStats } from "../../../service/BrainstormingKit.js";

export class DashboardBsPrototype extends DashboardPrototype {
    constructor() {
        super();
    }
    updateStats(stats: BrainstormingStats ) { stats }
}

export class DashboardBsChartPrototype extends DashboardBsPrototype {

    chart: Chart = null;

    constructor() {
        super();
    }
}
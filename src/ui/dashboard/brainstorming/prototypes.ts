import { DashboardPrototype, Eli } from "../prototypes";
import { BrainstormingStats } from "../../../service/BrainstormingKit.js";

export class DashboardBsPrototype extends DashboardPrototype {
    updateStats(stats: BrainstormingStats ) { stats }
}

export class DashboardBsChartPrototype extends DashboardBsPrototype {
    chart: Chart = null;
}

export { BrainstormingStats, Eli };
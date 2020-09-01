import { DashboardPrototype, DashboardChartProtorype, Eli, i18next } from "../prototypes";
import { BrainstormingStats } from "../../../service/BrainstormingKit.js";

export class DashboardBsPrototype extends DashboardPrototype {
    updateStats(stats: BrainstormingStats ) { stats }
}

export class DashboardBsChartPrototype extends DashboardBsPrototype {
    chart: Chart = null;

    /**
     * Build a MDC card with chart inside
     * 
     * @remarks
     * This method calls {@link DashboardChartProtorype | DashboardChartProtorype's method}
     * @param title     Title of the card
     * @param canvas    Canvas element for the chart
     * @param flex      Flex size of the card
     * @param minWidth  Mininum width fo the card
     * @returns The card element
     */
    static buildChartCard(
        title: string, canvas: HTMLCanvasElement, flex: number, minWidth: number
    ): HTMLDivElement {
        return DashboardChartProtorype.buildChartCard(title, canvas, flex, minWidth);
    }
}

export { BrainstormingStats, Eli, i18next };
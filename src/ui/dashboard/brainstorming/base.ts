import {
    DashboardPrototype, DashboardChartProtorype,
    i18next,
    eli,
    Nomination,
    BrainstormingStats, RateItems
} from "../base";

export class DashboardBsPrototype extends DashboardPrototype {
    updateStats(stats: BrainstormingStats) { stats }
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

    /**
     * Fill the <time, data> map with empty months
     * @param dataMap The map to be filled
     * @param start Start time
     * @param end End time
     */
    static fillTimeDataMap(dataMap: Map<number, number>, start: number, end: number) {
        DashboardChartProtorype.fillTimeDataMap(dataMap, start, end);
    }
}

export { i18next };
export { eli };
export { Nomination, BrainstormingStats, RateItems };
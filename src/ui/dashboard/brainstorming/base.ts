import { BrainstormingStats } from 'service/brainstorming';
import { base as dashboardBase } from 'ui/dashboard/base';

export namespace base {
    export class CardPrototype extends dashboardBase.CardPrototype {
        updateStats(stats: BrainstormingStats) { stats }
    }
    
    export class ChartCardPrototype extends CardPrototype {
        chart: Chart = null;
    }

    export const eliChartCard = dashboardBase.eliChartCard;

    export const buildChartCard = dashboardBase.buildChartCard;
    export const fillTimeDataMap = dashboardBase.fillTimeDataMap
}
<template>
<material-top-app-bar title="Charts" navi-back/>
<material-top-app-bar-adjust/>
<main class="charts">
    <div class="grid--2">
        <status-chart/>
        <reasons-chart/>
    </div>
    <count-by-month-chart/>
    <interval-chart/>
</main>
</template>

<script lang="ts">
import {
    Chart,
    ArcElement, BarElement, LineElement, PointElement,
    BarController, DoughnutController, LineController,
    CategoryScale, LogarithmicScale, LinearScale, TimeScale,
    Tooltip, Legend
} from 'chart.js';
import 'chartjs-adapter-luxon';
import { Vue, Options } from 'vue-class-component';

import MaterialTopAppBar from '@/components/material/TopAppBar.vue';
import MaterialTopAppBarAdjust from '@/components/material/TopAppBarAdjust.vue';
import CountByMonthChart from '@/components/charts/CountByMonth.vue';
import IntervalChart from '@/components/charts/Interval.vue';
import ReasonsChart from '@/components/charts/Reasons.vue';
import StatusChart from '@/components/charts/Status.vue';

@Options({
    components: {
        MaterialTopAppBar, MaterialTopAppBarAdjust,
        StatusChart, ReasonsChart,
        CountByMonthChart,
        IntervalChart
    },
})
export default class Charts extends Vue {

    created() {
        Chart.register(
            ArcElement, BarElement, LineElement, PointElement,
            BarController, DoughnutController, LineController,
            CategoryScale, LinearScale, LogarithmicScale, TimeScale,
            Tooltip, Legend
        );
        Chart.defaults.maintainAspectRatio = false;
        Chart.defaults.plugins.legend!.labels.boxWidth = 10;
        Chart.defaults.plugins.tooltip!.intersect = false;
        Chart.defaults.elements.line!.tension = 0.1;
    }
}
</script>

<style lang="scss">
.charts {
    padding: 1rem;

    > div:not(:first-child) {
        margin-block-start: 0.6rem;
    }

    > .grid--2 {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.6rem;

        @media screen and (min-width: 600px) {
            grid-template-columns: 1fr 1fr;
        }
    }
}
</style>
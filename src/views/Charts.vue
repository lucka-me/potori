<template>
<material-top-app-bar title="Charts" navi-back/>
<material-top-app-bar-adjust/>
<main class="charts">
    <div class="grid--2">
        <status-chart/>
        <reasons-chart/>
    </div>
    <status-chart/>
</main>
</template>

<script lang="ts">
import {
    Chart,
    ArcElement,
    DoughnutController,
    Tooltip,
    Legend
} from 'chart.js';
import { Vue, Options } from 'vue-class-component';

import MaterialTopAppBar from '@/components/material/TopAppBar.vue';
import MaterialTopAppBarAdjust from '@/components/material/TopAppBarAdjust.vue';
import ReasonsChart from '@/components/charts/Reasons.vue';
import StatusChart from '@/components/charts/Status.vue';

@Options({
    components: {
        MaterialTopAppBar, MaterialTopAppBarAdjust,
        StatusChart, ReasonsChart
    },
})
export default class Charts extends Vue {

    created() {
        Chart.register(
            ArcElement,
            DoughnutController,
            Tooltip,
            Legend
        );
        Chart.defaults.maintainAspectRatio = false;
        Chart.defaults.plugins.legend!.labels.boxWidth = 10;
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
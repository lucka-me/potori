<template>
<chart-block title="Quotas (Days)">
    <chart-view chart-type="bar" :chart-datasets="datasets" :chart-labels="labels" :chart-options="options"/>
</chart-block>
</template>

<script lang="ts">
import { ChartDataset, ChartOptions } from 'chart.js';
import { Vue, Options } from 'vue-property-decorator';

import ChartBlock from './ChartBlock.vue';
import ChartView from './ChartView.vue';

@Options({
    components: {
        ChartBlock, ChartView
    }
})
export default class QuotasChart extends Vue {

    private static readonly timeDay = 24 * 3600 * 1000;

    options: ChartOptions<'bar'> = {
        plugins: {
            legend: { display: false }
        }
    };

    get labels(): Array<number> {
        const labels: Array<number> = [];
        for (let i = 0; i < 14; i++) {
            labels.push(i);
        }
        return labels;
    }

    get datasets(): Array<ChartDataset<'bar'>> {
        const nominations = this.$store.state.nominations;
        const now = Date.now();
        const data = new Array(14).fill(0);
        for (const nomination of nominations) {
            const restoreTime = nomination.restoreTime;
            if (restoreTime > now) {
                data[Math.floor((restoreTime - now) / QuotasChart.timeDay)] += 1;
            }
        }
        const dataset: ChartDataset<'bar'> = {
            data: data,
            backgroundColor: 'royalblue',
            hoverBackgroundColor: 'royalblue',
        };
        return [ dataset ];
    }
}
</script>

<style lang="scss">

</style>
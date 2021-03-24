<template>
<chart-block title="Coverage">
    <chart-view chart-type="doughnut" :chart-datasets="datasets" :chart-labels="labels" :chart-options="options"/>
</chart-block>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-property-decorator';

import { brainstorming } from '@/service/brainstorming';

import ChartBlock from '@/components/charts/ChartBlock.vue';
import ChartView, { ChartDataset, ChartOptions } from '@/components/charts/ChartView.vue';

@Options({
    components: {
        ChartBlock, ChartView
    }
})
export default class CoverageChart extends Vue {

    private static readonly colors = [ 'royalblue', 'gray' ];

    options: ChartOptions<'doughnut'> = {
        plugins: {
            legend: { display: true, position: 'right', },
        }
    };

    labels: Array<string> = [ 'Covered', 'Not Covered' ];

    datasets: Array<ChartDataset<'doughnut'>> = [];

    mounted() {
        this.updateData();
    }

    private async updateData() {
        const nominations = this.$store.state.nominations;
        const data = [ 0, 0 ];
        for (const nomination of nominations) {
            data[await brainstorming.contains(nomination) ? 0 : 1]++;
        }
        console.log(data);
        const dataset: ChartDataset<'doughnut'> = {
            data: data,
            backgroundColor: CoverageChart.colors,
            borderAlign: 'inner',
            borderColor: 'rgba(0, 0, 0, 0.2)',
            hoverBackgroundColor: CoverageChart.colors,
            hoverBorderColor: 'rgba(0, 0, 0, 0.4)',
        };
        this.datasets = [ dataset ];
    }
}
</script>

<style lang="scss">

</style>
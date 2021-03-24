<template>
<chart-block :title="title">
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

    title = 'Coverage';

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
        const queries: Array<Promise<void>> = [];
        for (const nomination of nominations) {
            const query = brainstorming.contains(nomination)
                .then(contains => {
                    data[contains ? 0 : 1]++;
                })
            queries.push(query);
        }
        await Promise.allSettled(queries);
        const dataset: ChartDataset<'doughnut'> = {
            data: data,
            backgroundColor: CoverageChart.colors,
            borderAlign: 'inner',
            borderColor: 'rgba(0, 0, 0, 0.2)',
            hoverBackgroundColor: CoverageChart.colors,
            hoverBorderColor: 'rgba(0, 0, 0, 0.4)',
        };
        this.datasets = [ dataset ];
        if (data[0] > 0 || data[1] > 0) {
            this.title = `Coverage | ${(data[0] / (data[0] + data[1]) * 100).toFixed(2)}%`;
        } else {
            this.title = '';
        }
    }
}
</script>

<style lang="scss">

</style>
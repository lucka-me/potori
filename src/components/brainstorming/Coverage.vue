<template>
<chart-block :title="title">
    <chart-view chart-type="doughnut" :chart-datasets="datasets" :chart-labels="labels" :chart-options="options"/>
</chart-block>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-property-decorator';

import { brainstorming } from '@/service/brainstorming';
import { dia } from '@/service/dia';

import ChartBlock from '@/components/charts/ChartBlock.vue';
import ChartView, { ChartDataset, ChartOptions } from '@/components/charts/ChartView.vue';

import locales from './Coverage.locales.json';

@Options({
    components: {
        ChartBlock, ChartView
    },
    i18n: {
        messages: locales
    }
})
export default class CoverageChart extends Vue {

    private static readonly colors = [ 'royalblue', 'gray', 'orange' ];

    options: ChartOptions<'doughnut'> = {
        plugins: {
            legend: { display: true, position: 'right', },
        }
    };

    datasets: Array<ChartDataset<'doughnut'>> = [];

    private rate = 0;

    get title(): string {
        const title = this.$t('title');
        if (this.rate === 0) return title;
        return `${title} | ${this.rate.toFixed(2)}%`
    }

    get labels(): Array<string> {
        return [ this.$t('recorded'), this.$t('notRecorded'), this.$t('early') ];
    }

    mounted() {
        this.updateData();
    }

    private async updateData() {
        const nominations = await dia.getAll();
        const data = [ 0, 0, 0 ];
        const queries: Array<Promise<void>> = [];
        for (const nomination of nominations) {
            if (brainstorming.beforeCreate(nomination)) {
                data[2]++;
                continue;
            }
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
            this.rate = data[0] / (data[0] + data[1] + data[2]) * 100;
        } else {
            this.rate = 0;
        }
    }
}
</script>

<style lang="scss">

</style>
<template>
<chart-block :title="$t('title')">
    <chart-view chart-type="doughnut" :chart-datasets="datasets" :chart-labels="labels" :chart-options="options"/>
</chart-block>
</template>

<script lang="ts">
import { Vue, Options, Watch } from 'vue-property-decorator';

import { dia } from '@/service/dia';
import { umi } from '@/service/umi';

import ChartBlock from './ChartBlock.vue';
import ChartView, { ChartDataset, ChartOptions } from './ChartView.vue';

import locales from './Status.locales.json';

@Options({
    components: {
        ChartBlock, ChartView
    },
    i18n: {
        messages: locales
    }
})
export default class StatusChart extends Vue {

    private static readonly colors = [ '#CAAF85', '#35C572', '#B0373C' ];

    options: ChartOptions<'doughnut'> = {
        plugins: {
            legend: { display: true, position: 'right', },
        }
    };

    get labels(): Array<string> {
        const labels: Array<string> = [];
        for (const status of umi.status.values()) {
            labels.push(status.title);
        }
        return labels;
    }

    datasets: Array<ChartDataset<'doughnut'>> = [];

    get saveID(): number {
        return this.$store.state.dia.saveID;
    }

    created() {
        this.updateData();
    }

    @Watch('saveID')
    onSaved() {
        this.updateData();
    }

    private async updateData() {
        const stats = new Map<umi.StatusCode, number>();
        for (const code of umi.status.keys()) {
            stats.set(code, 0);
        }
        const nominations = await dia.getAll();
        nominations.reduce((map, nomination) => {
            map.set(nomination.status, map.get(nomination.status)! + 1);
            return map;
        }, stats);

        const data: Array<number> = [];
        for (const count of stats.values()) {
            data.push(count);
        }
        const dataset: ChartDataset<'doughnut'> = {
            data: data,
            backgroundColor: StatusChart.colors,
            borderAlign: 'inner',
            borderColor: 'rgba(0, 0, 0, 0.2)',
            hoverBackgroundColor: StatusChart.colors,
            hoverBorderColor: 'rgba(0, 0, 0, 0.4)',
        };
        this.datasets = [ dataset ];
    }
}
</script>

<style lang="scss">

</style>
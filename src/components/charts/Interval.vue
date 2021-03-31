<template>
<chart-block :title="$t('title')">
    <chart-view chart-type="bar" :chart-datasets="datasets" :chart-labels="labels" :chart-options="options"/>
</chart-block>
</template>

<script lang="ts">
import { Vue, Options, Watch } from 'vue-property-decorator';

import { dia } from '@/service/dia';
import { umi } from '@/service/umi';

import ChartBlock from './ChartBlock.vue';
import ChartView, { ChartDataset, ChartOptions } from './ChartView.vue';

import locales from './Interval.locales.json';

@Options({
    components: {
        ChartBlock, ChartView
    },
    i18n: {
        messages: locales
    }
})
export default class IntervalChart extends Vue {

    private static readonly timeValid = 1325347200;
    private static readonly timeDay = 24 * 3600 * 1000;

    options: ChartOptions<'bar'> = {
        plugins: {
            legend: { display: false }
        }
    };

    labels: Array<number> = [];

    datasets: Array<ChartDataset<'bar'>> = [];

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
        const nominations = await dia.getAll();
        const raw = nominations.reduce((map, nomination) => {
            if (nomination.status === umi.StatusCode.Pending) return map;
            if (nomination.confirmedTime < IntervalChart.timeValid) return map;
            if (nomination.resultTime < IntervalChart.timeValid) return map;
            if (nomination.resultTime < nomination.confirmedTime) return map;
            const interval = Math.floor((nomination.resultTime - nomination.confirmedTime) / IntervalChart.timeDay);
            map.set(interval, (map.get(interval) ?? 0) + 1);
            return map;
        }, new Map<number, number>());
        const stats: Array<{ interval: number, count: number}> = [];
        for (const [interval, count] of raw) {
            stats.push({ interval: interval, count: count });
        }
        stats.sort((a, b) => a.interval - b.interval);
        const data = stats.map((data) => data.count);
        const dataset: ChartDataset<'bar'> = {
            data: data,
            backgroundColor: 'royalblue',
            hoverBackgroundColor: 'royalblue',
        };
        this.labels = stats.map(data => data.interval);
        this.datasets = [ dataset ];
    }
}
</script>

<style lang="scss">

</style>
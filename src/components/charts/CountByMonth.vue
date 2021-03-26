<template>
<chart-block :title="$t('title')">
    <chart-view chart-type="line" :chart-datasets="datasets" :chart-options="options"/>
</chart-block>
</template>

<script lang="ts">
import { DateTime } from 'luxon';
import { Vue, Options } from 'vue-property-decorator';

import ChartBlock, { fillTimeCountMap } from './ChartBlock.vue';
import ChartView, { ChartDataset, ChartOptions } from './ChartView.vue';

import locales from './CountByMonth.locales.json';

@Options({
    components: {
        ChartBlock, ChartView
    },
    i18n: {
        messages: locales
    }
})
export default class CountByMonthChart extends Vue {

    options: ChartOptions<'line'> = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'month',
                    tooltipFormat: 'yyyy-MM',
                    displayFormats: { month: 'yyyy-MM', }
                }
            }
        },
        plugins: {
            tooltip: { mode: 'x' }
        }
    };

    get datasets(): Array<ChartDataset<'line'>> {
        const nominations = this.$store.state.nominations;
        const mapSubmissions = new Map<number, number>();
        const mapResults = new Map<number, number>();
        if (nominations.length > 0) {
            let min = DateTime.fromMillis(nominations[0].confirmedTime).startOf('month').valueOf();
            let max = min;
            for (const nomination of nominations) {
                if (nomination.confirmedTime > 0) {
                    const time = DateTime.fromMillis(nomination.confirmedTime).startOf('month').valueOf();
                    if (time < min) min = time;
                    else if (time > max) max = time;
                    mapSubmissions.set(time, (mapSubmissions.get(time) ?? 0) + 1);
                }
                if (nomination.resultTime > 0) {
                    const time = DateTime.fromMillis(nomination.resultTime).startOf('month').valueOf();
                    if (time > max) max = time;
                    mapResults.set(time, (mapResults.get(time) ?? 0) + 1);
                }
            }
            fillTimeCountMap(mapSubmissions, min, max);
            fillTimeCountMap(mapResults, min, max);
        }
        const dataSubmissions: Array<{ x: number, y: number }> = [];
        const dataResults: Array<{ x: number, y: number }> = [];
        for (const [time, count] of mapSubmissions) {
            dataSubmissions.push({ x: time, y: count });
        }
        for (const [time, count] of mapResults) {
            dataResults.push({ x: time, y: count });
        }
        dataSubmissions.sort((a, b) => a.x - b.x);
        dataResults.sort((a, b) => a.x - b.x);

        const datasetSubmissions: ChartDataset<'line'> = {
            label: this.$t('submissions'),
            data: dataSubmissions,
            borderColor: 'orange',
            pointBackgroundColor: 'orange',
            pointRadius: 0,
            fill: false,
        };
        const datasetResults: ChartDataset<'line'> = {
            label: this.$t('results'),
            data: dataResults,
            borderColor: 'royalblue',
            pointBackgroundColor: 'royalblue',
            pointRadius: 0,
            fill: false,
        };
        return [ datasetSubmissions, datasetResults ];
    }
}
</script>

<style lang="scss">

</style>
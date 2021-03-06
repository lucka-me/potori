<template>
<chart-card :title="$t('title')">
    <chart-view chart-type="line" :chart-datasets="datasets" :chart-options="options"/>
</chart-card>
</template>

<script lang="ts">
import { DateTime } from 'luxon';
import { Vue, Options } from 'vue-property-decorator';

import { brainstorming } from '@/service/brainstorming';
import { dia } from '@/service/dia';

import ChartCard, { fillTimeCountMap } from '@/components/basic/ChartCard.vue';
import ChartView, { ChartDataset, ChartOptions } from '@/components/basic/ChartView.vue';

import locales from './ReviewsByMonth.locales.json';

@Options({
    components: {
        ChartCard, ChartView
    },
    i18n: {
        messages: locales
    }
})
export default class ReviewsByMonthChart extends Vue {

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
            legend: { display: false },
            tooltip: { mode: 'x' }
        }
    };

    datasets: Array<ChartDataset<'line'>> = [];

    mounted() {
        this.updateData();
    }

    private async updateData() {
        const nominations = await dia.getAll();
        const stats = new Map<number, number>();
        if (nominations.length > 0) {
            let min = DateTime.fromMillis(nominations[0].confirmedTime).startOf('month').valueOf();
            let max = min;
            const queries: Array<Promise<void>> = [];
            for (const nomination of nominations) {
                const query = brainstorming.getFromLocal(nomination)
                    .then(record => {
                        if (!record) return;
                        for (const [key, value] of Object.entries(record)) {
                            if (!key.startsWith('review_')) continue;
                            const review = value as brainstorming.Review;
                            const time = DateTime.fromMillis(review.Timestamp).startOf('month').valueOf();
                            if (time < min) min = time;
                            else if (time > max) max = time;
                            stats.set(time, (stats.get(time) ?? 0) + 1);
                        }
                    });
                queries.push(query);
            }
            await Promise.allSettled(queries);
            fillTimeCountMap(stats, min, max);
        }
        const data:  Array<{ x: number, y: number }> = [];
        for (const [time, count] of stats) {
            data.push({ x: time, y: count });
        }
        data.sort((a, b) => a.x - b.x);

        const dataset: ChartDataset<'line'> = {
            data: data,
            borderColor: 'royalblue',
            pointBackgroundColor: 'royalblue',
            pointRadius: 0,
            fill: true,
        };
        this.datasets = [ dataset ];
    }
}
</script>

<style lang="scss">

</style>
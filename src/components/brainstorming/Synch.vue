<template>
<chart-block :title="title">
    <chart-view chart-type="doughnut" :chart-datasets="datasets" :chart-labels="labels" :chart-options="options"/>
</chart-block>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-property-decorator';

import { brainstorming } from '@/service/brainstorming';
import { umi } from '@/service/umi';

import ChartBlock from '@/components/charts/ChartBlock.vue';
import ChartView, { ChartDataset, ChartOptions } from '@/components/charts/ChartView.vue';

import locales from './Synch.locales.json';

@Options({
    components: {
        ChartBlock, ChartView
    },
    i18n: {
        messages: locales
    }
})
export default class CoverageChart extends Vue {

    private static readonly colors = [ 'royalblue', 'gray' ];

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
        return [ this.$t('synched'), this.$t('notSynched') ];
    }

    mounted() {
        this.updateData();
    }

    private async updateData() {
        const nominations = this.$store.state.data.nominations;
        const data = [ 0, 0 ];
        const queries: Array<Promise<void>> = [];
        for (const nomination of nominations) {
            if (nomination.status === umi.StatusCode.Pending) continue;
            let rejected = true;
            let duplicated = false;
            if (nomination.status === umi.StatusCode.Rejected) {
                if (nomination.reasons.includes(umi.Reason.duplicated)) {
                    duplicated = true
                } else if (nomination.reasons.includes(umi.Reason.close)) {
                    rejected = false;
                }
            } else {
                rejected = false;
            }
            const query = brainstorming.getFromLocal(nomination)
                .then(record => {
                    if (!record) return;
                    for (const [key, value] of Object.entries(record)) {
                        if (!key.startsWith('review_')) continue;
                        const review = value as brainstorming.Review;
                        // Duplicated
                        if (review.stars === 'D') {
                            data[duplicated ? 0 : 1]++;
                            continue;
                        }
                        const stars = parseInt(review.stars);
                        if (isNaN(stars)) continue;
                        if ((stars < 3 && rejected) || (stars >= 3 && !rejected)) {
                            data[0]++;
                        } else {
                            data[1]++
                        }
                    }
                });
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
            this.rate = data[0] / (data[0] + data[1]) * 100;
        } else {
            this.rate = 0;
        }
    }
}
</script>

<style lang="scss">

</style>
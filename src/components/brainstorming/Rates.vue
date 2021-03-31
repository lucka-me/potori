<template>
<chart-block :title="$t('title')">
    <chart-view chart-type="radar" :chart-datasets="datasets" :chart-labels="labels" :chart-options="options"/>
</chart-block>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-property-decorator';

import { brainstorming } from '@/service/brainstorming';

import ChartBlock from '@/components/charts/ChartBlock.vue';
import ChartView, { ChartDataset, ChartOptions } from '@/components/charts/ChartView.vue';

import locales from './Rates.locales.json';

@Options({
    components: {
        ChartBlock, ChartView
    },
    i18n: {
        messages: locales
    }
})
export default class RatesChart extends Vue {

    options: ChartOptions<'radar'> = {
        elements: {
            line: { tension: 0 }
        },
        scales: {
            r: {
                min: 1, max: 5,
                ticks: { stepSize: 1 }
            }
        },
        plugins: {
            legend: { display: false },
        }
    };

    datasets: Array<ChartDataset<'radar'>> = [];

    get labels(): Array<string> {
        return [
            this.$t('quality'),
            this.$t('description'),
            this.$t('cultural'),
            this.$t('uniqueness'),
            this.$t('safety'),
            this.$t('location')
        ];
    }

    mounted() {
        this.updateData();
    }

    private async updateData() {
        const nominations = this.$store.state.data.nominations;
        type ReviewItem = { count: number, rate: number };
        const stats: Array<ReviewItem> = [];
        for (let i = 0; i < 6; ++i) {
            stats.push({ count: 0, rate: 0 });
        }
        const updateReviewItem = (rate: string, item: ReviewItem) => {
            if (!rate) return;
            const rateInt = parseInt(rate);
            if (isNaN(rateInt)) return;
            item.count++;
            item.rate += rateInt;
        };
        const queries: Array<Promise<void>> = [];
        for (const nomination of nominations) {
            const query = brainstorming.getFromLocal(nomination)
                .then(record => {
                    if (!record) return;
                    for (const [key, value] of Object.entries(record)) {
                        if (!key.startsWith('review_')) continue;
                        const review = value as brainstorming.Review;
                        updateReviewItem(review.JSON.quality, stats[0]);
                        updateReviewItem(review.JSON.description, stats[1]);
                        updateReviewItem(review.JSON.cultural, stats[2]);
                        updateReviewItem(review.JSON.uniqueness, stats[3]);
                        updateReviewItem(review.JSON.safety, stats[4]);
                        updateReviewItem(review.JSON.location, stats[5]);
                    }
                });
            queries.push(query);
        }
        await Promise.allSettled(queries);
        const data = stats.map(item => item.rate / item.count);
        const dataset: ChartDataset<'radar'> = {
            data: data,
            borderColor: 'royalblue',
        };
        this.datasets = [ dataset ];
    }
}
</script>

<style lang="scss">

</style>
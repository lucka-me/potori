<template>
<chart-block :title="$t('title')">
    <chart-view chart-type="bar" :chart-datasets="datasets" :chart-labels="labels" :chart-options="options"/>
</chart-block>
</template>

<script lang="ts">
import { dia } from '@/service/dia';
import Nomination from '@/service/nomination';
import { Vue, Options, Watch } from 'vue-property-decorator';

import ChartBlock from './ChartBlock.vue';
import ChartView, { ChartDataset, ChartOptions } from './ChartView.vue';

import locales from './Quotas.locales.json';

@Options({
    components: {
        ChartBlock, ChartView
    },
    i18n: {
        messages: locales
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
        const raws = await dia.getAll();
        const nominations = raws.map(raw => Nomination.from(raw));
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
        this.datasets = [ dataset ];
    }
}
</script>

<style lang="scss">

</style>
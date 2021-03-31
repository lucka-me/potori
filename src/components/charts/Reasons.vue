<template>
<chart-block :title="$t('title')">
    <chart-view chart-type="doughnut" :chart-datasets="datasets" :chart-labels="labels" :chart-options="opitons"/>
</chart-block>
</template>

<script lang="ts">
import { Vue, Options, Watch } from 'vue-property-decorator';

import { umi } from '@/service/umi';

import ChartBlock from './ChartBlock.vue';
import ChartView, { ChartDataset, ChartOptions } from './ChartView.vue';

import locales from './Reasons.locales.json';
import { dia } from '@/service/dia';

@Options({
    components: {
        ChartBlock, ChartView
    },
    i18n: {
        messages: locales
    }
})
export default class ReasonsChart extends Vue {

    opitons: ChartOptions<'doughnut'> = {
        plugins: {
            legend: { display: true, position: 'right', },
        }
    };

    labels: Array<string> = [];

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
        const stats = new Map<umi.ReasonCode, [umi.Reason, number]>();
        for (const [code, reason] of umi.reason) {
            stats.set(code, [reason, 0]);
        }
        const nominations = await dia.getAll(umi.status.get(umi.StatusCode.Rejected)!.predicator);
        nominations.reduce((map, nomination) => {
            if (nomination.status !== umi.StatusCode.Rejected) return map;
            if (nomination.reasons.length > 0) {
                for (const code of nomination.reasons) {
                    map.get(code)![1]++;
                }
            } else {
                map.get(umi.Reason.undeclared)![1]++;
            }
            return map;
        }, stats);
        const labels: Array<string> = [];
        const data: Array<number> = [];
        const colors: Array<string> = [];
        for (const pair of stats.values()) {
            if (pair[1] < 1) continue;
            labels.push(pair[0].title);
            data.push(pair[1]);
            colors.push(pair[0].color);
        }
        const dataset: ChartDataset<'doughnut'> = {
            data: data,
            backgroundColor: colors,
            borderAlign: 'inner',
            borderColor: 'rgba(0, 0, 0, 0.2)',
            hoverBackgroundColor: colors,
            hoverBorderColor: 'rgba(0, 0, 0, 0.4)',
        };
        this.labels = labels;
        this.datasets = [ dataset ];
    }
}
</script>

<style lang="scss">

</style>
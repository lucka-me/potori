<template>
<chart-block title="Reasons">
    <chart-view chart-type="doughnut" :chart-datasets="datasets" :chart-labels="labels" :chart-options="opitons"/>
</chart-block>
</template>

<script lang="ts">
import { ChartDataset, ChartOptions } from 'chart.js';
import { Vue, Options } from 'vue-property-decorator';

import { umi } from '@/service/umi';

import ChartBlock from './ChartBlock.vue';
import ChartView from './ChartView.vue';

@Options({
    components: {
        ChartBlock, ChartView
    }
})
export default class ReasonsChart extends Vue {

    opitons: ChartOptions<'doughnut'> = {
        plugins: {
            legend: { display: true, position: 'right', },
        }
    };

    get labels(): Array<string> {
        const stats = this.stats;
        const labels: Array<string> = [];
        for (const pair of stats.values()) {
            if (pair[1] < 1) continue;
            labels.push(pair[0].title);
        }
        return labels;
    }

    get datasets(): Array<ChartDataset<'doughnut'>> {
        const stats = this.stats;
        const data: Array<number> = [];
        const colors: Array<string> = [];
        for (const pair of stats.values()) {
            if (pair[1] < 1) continue;
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
        return [ dataset ];
    }

    private get stats(): Map<umi.ReasonCode, [umi.Reason, number]> {
        const stats = new Map<umi.ReasonCode, [umi.Reason, number]>();
        for (const [code, reason] of umi.reason) {
            stats.set(code, [reason, 0]);
        }
        this.$store.state.nominations.reduce((map, nomination) => {
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
        return stats;
    }
}
</script>

<style lang="scss">

</style>
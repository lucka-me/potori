<template>
<chart-block title="Reasons"/>
</template>

<script lang="ts">
import { umi } from '@/service/umi';
import { Chart } from 'chart.js';
import { Vue, Options } from 'vue-property-decorator';

import ChartBlock from './ChartBlock.vue';

@Options({
    components: {
        ChartBlock
    }
})
export default class ReasonsChart extends Vue {

    private chart?: Chart;
    $el!: HTMLDivElement;
    
    mounted() {
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

        const data: Array<number> = [];
        const labels: Array<string> = [];
        const colors: Array<string> = [];
        for (const pair of stats.values()) {
            if (pair[1] < 1) continue;
            data.push(pair[1]);
            labels.push(pair[0].title);
            colors.push(pair[0].color);
        }

        this.chart = new Chart(this.$el.querySelector('canvas')!, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderAlign: 'inner',
                    borderColor: 'rgba(0, 0, 0, 0.2)',
                    hoverBackgroundColor: colors,
                    hoverBorderColor: 'rgba(0, 0, 0, 0.4)',
                }]
            },
            options: {
                plugins: {
                    legend: { display: true, position: 'right', },
                }
            }
        });
    }

    unmounted() {
        this.chart?.destroy();
    }
}
</script>

<style lang="scss">

</style>
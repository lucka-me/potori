<template>
<chart-block title="Interval (Days)"/>
</template>

<script lang="ts">
import { Chart } from 'chart.js';
import { Vue, Options } from 'vue-property-decorator';

import { umi } from '@/service/umi';

import ChartBlock from './ChartBlock.vue';

@Options({
    components: {
        ChartBlock
    }
})
export default class IntervalChart extends Vue {

    private static readonly timeValid = 1325347200;
    private static readonly timeDay = 24 * 3600 * 1000;

    private chart?: Chart;
    $el!: HTMLDivElement;
    
    mounted() {
        const nominations = this.$store.state.nominations;
        const state = nominations.reduce((map, nomination) => {
            if (nomination.status === umi.StatusCode.Pending) return map;
            if (nomination.confirmedTime < IntervalChart.timeValid) return map;
            if (nomination.resultTime < IntervalChart.timeValid) return map;
            if (nomination.resultTime < nomination.confirmedTime) return map;
            const interval = Math.floor((nomination.resultTime - nomination.confirmedTime) / IntervalChart.timeDay);
            map.set(interval, (map.get(interval) ?? 0) + 1);
            return map;
        }, new Map<number, number>());
        const pairs: Array<{ interval: number, count: number}> = [];
        for (const [interval, count] of state) {
            pairs.push({ interval: interval, count: count });
        }
        pairs.sort((a, b) => a.interval - b.interval);
        const labels = pairs.map((pair) => pair.interval);
        const data = pairs.map((pair) => pair.count);

        this.chart = new Chart(this.$el.querySelector('canvas')!, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: 'royalblue',
                    hoverBackgroundColor: 'royalblue',
                }],
            },
            options: {
                plugins: {
                    legend: { display: false }
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
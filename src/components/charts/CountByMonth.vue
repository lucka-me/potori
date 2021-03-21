<template>
<chart-block title="Count by Month"/>
</template>

<script lang="ts">
import { Chart } from 'chart.js';
import { DateTime } from 'luxon';
import { Vue, Options } from 'vue-property-decorator';

import ChartBlock, { fillTimeCountMap } from './ChartBlock.vue';

@Options({
    components: {
        ChartBlock
    }
})
export default class CountByMonthChart extends Vue {

    private chart?: Chart;
    $el!: HTMLDivElement;
    
    mounted() {
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

        this.chart = new Chart(this.$el.querySelector('canvas')!, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Submissions',
                    data: dataSubmissions,
                    borderColor: 'orange',
                    pointBackgroundColor: 'orange',
                    pointRadius: 0,
                    fill: false,
                }, {
                    label: 'Results',
                    data: dataResults,
                    borderColor: 'royalblue',
                    pointBackgroundColor: 'royalblue',
                    pointRadius: 0,
                    fill: false,
                }],
            },
            options: {
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
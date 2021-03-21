<template>
<chart-block title="Quotas (Days)"/>
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
export default class QuotasChart extends Vue {

    private static readonly timeValid = 1325347200;
    private static readonly timeDay = 24 * 3600 * 1000;

    private chart?: Chart;
    $el!: HTMLDivElement;
    
    mounted() {
        const nominations = this.$store.state.nominations;
        const now = Date.now();
        const labels: Array<number> = [];
        for (let i = 0; i < 14; i++) {
            labels.push(i);
        }
        const data = new Array(14).fill(0);
        for (const nomination of nominations) {
            const restoreTime = nomination.restoreTime;
            if (restoreTime > now) {
                data[Math.floor((restoreTime - now) / (24 * 3600 * 1000))] += 1;
            }
        }

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
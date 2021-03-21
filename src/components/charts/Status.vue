<template>
<chart-block title="Status"/>
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
export default class StatusChart extends Vue {

    private chart?: Chart;
    $el!: HTMLDivElement;
    
    mounted() {
        const stats = new Map<umi.StatusCode, number>();
        const labels: Array<string> = [];
        for (const [code, status] of umi.status) {
            stats.set(code, 0);
            labels.push(status.title);
        }
        this.$store.state.nominations.reduce((map, nomination) => {
            map.set(nomination.status, map.get(nomination.status)! + 1);
            return map;
        }, stats);

        const data: Array<number> = [];
        for (const count of stats.values()) {
            data.push(count);
        }

        this.chart = new Chart(this.$el.querySelector('canvas')!, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [ 'yellow', 'green', 'red' ],
                    borderAlign: 'inner',
                    borderColor: 'rgba(0, 0, 0, 0.2)',
                    hoverBackgroundColor: [ 'yellow', 'green', 'red' ],
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
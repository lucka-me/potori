<template>
<div class="chart">
    <span>{{ title }}</span>
    <div class="chart-container"><canvas/></div>
</div>
</template>

<script lang="ts">
import { DateTime } from 'luxon';
import { Vue, Prop } from 'vue-property-decorator';

export default class ChartBlock extends Vue {
    @Prop(String) readonly title!: string;
}

/**
     * Fill the <time, count> map with empty months
     * @param dataMap The map to be filled
     * @param start Start time
     * @param end End time
     */
    export function fillTimeCountMap(map: Map<number, number>, start: number, end: number) {
        let scan = start;
        while (scan <= end) {
            const month = DateTime.fromMillis(scan + 1000).startOf('month');
            const key = month.valueOf();
            if (!map.has(key)) map.set(key, 0);
            scan = month.endOf('month').valueOf();
        }
    }
</script>

<style lang="scss">
@use '~@material/card';
.chart {
    @include card.shape-radius(card.$shape-radius);
    @include card.outline(card.$outline-color);
    padding: 0.4rem;
    display: flex;
    flex-flow: column nowrap;

    > div {
        margin-block-start: 0.2rem;
        flex: 1;
        height: 12rem;
        position: relative;

        > canvas {
            width: 100% !important;
            height: 100% !important;
        }
    }
}
</style>
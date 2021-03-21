<template>
<div class="chart">
    <span>{{ title }}</span>
    <div class="chart-container"><canvas/></div>
</div>
</template>

<script lang="ts">
import { Vue, Prop } from 'vue-property-decorator';

export default class ChartBlock extends Vue {
    @Prop(String) readonly title!: string;
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
        height: 10rem;
        position: relative;

        > canvas {
            width: 100% !important;
            height: 100% !important;
        }
    }
}
</style>
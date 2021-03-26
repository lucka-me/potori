<template>
<div class="chart-container"><canvas/></div>
</template>

<script lang="ts">
import { toRaw } from '@vue/reactivity';
import { Chart, ChartDataset, ChartOptions, ChartType, DefaultDataPoint } from 'chart.js';
import { Vue, Prop, Watch } from 'vue-property-decorator';

export default class ChartView<
    TType extends ChartType = ChartType,
    TData = DefaultDataPoint<TType>,
    TLabel = unknown
> extends Vue {

    @Prop({ type: String, required: true }) readonly chartType!: TType;
    @Prop({ type: Array, required: true }) readonly chartDatasets!: Array<ChartDataset<TType, TData>>;
    @Prop({ type: Array }) readonly chartLabels?: Array<TLabel>;
    @Prop({ type: Object }) readonly chartOptions?: ChartOptions<TType>;

    $el!: HTMLDivElement;

    private chart?: Chart<TType, TData, TLabel>;
    
    mounted() {
        this.chart = new Chart(this.$el.querySelector('canvas')!, {
            type: this.chartType,
            data: {
                labels: this.chartLabels,
                datasets: this.chartDatasets
            },
            options: this.chartOptions
        });
    }

    unmounted() {
        this.chart?.destroy();
    }

    @Watch('chartDatasets')
    onDatasetChanged(newVal: Array<ChartDataset<TType, TData>>, _: unknown) {
        if (!this.chart) return;
        this.chart.data.datasets = toRaw(newVal);
        this.chart.update();
    }

    @Watch('chartLabels')
    onLabelsUpdated(newVal: Array<TLabel>, _: unknown) {
        if (!this.chart) return;
        this.chart.data.labels = toRaw(newVal);
        this.chart.update();
    }
}

export type { ChartDataset, ChartOptions, ChartType };
</script>

<style lang="scss">
.chart-container {
    position: relative;

    > canvas {
        width: 100% !important;
        height: 100% !important;
    }
}
</style>
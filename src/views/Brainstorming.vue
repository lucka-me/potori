<template>
<material-top-app-bar :title="$t('title')" navi-back>
    <material-icon-button v-if="canUpdate" icon="redo" :title="$t('update')" @click="update"/>
</material-top-app-bar>
<material-top-app-bar-adjust/>
<main v-if="!empty" class="brainstorming">
    <linear-progress v-if="updating" :text="$t('updating')" determinate/>
    <div v-if="idle" class="grid grid--1-1-1">
        <coverage-chart/>
        <rates-chart/>
        <synch-chart/>
    </div>
    <reviews-by-month-chart v-if="idle"/>
</main>
</template>

<script lang="ts">
import {
    Chart,
    ArcElement, LineElement, PointElement,
    DoughnutController, LineController, RadarController,
    RadialLinearScale, LinearScale, TimeScale,
    Filler, Tooltip, Legend,
} from 'chart.js';
import 'chartjs-adapter-luxon';
import { Vue, Options, Watch } from 'vue-property-decorator';

import { delibird } from '@/service/delibird';
import { dia } from '@/service/dia';
import { service } from '@/service';

import MaterialIconButton from '@/components/material/IconButton.vue';
import MaterialTopAppBar from '@/components/material/TopAppBar.vue';
import MaterialTopAppBarAdjust from '@/components/material/TopAppBarAdjust.vue';
import LinearProgress from '@/components/basic/LinearProgress.vue';
import CoverageChart from '@/components/brainstorming/Coverage.vue';
import RatesChart from '@/components/brainstorming/Rates.vue';
import ReviewsByMonthChart from '@/components/brainstorming/ReviewsByMonth.vue';
import SynchChart from '@/components/brainstorming/Synch.vue';

import locales from './Brainstorming.locales.json';

@Options({
    components: {
        MaterialTopAppBar, MaterialTopAppBarAdjust,
        MaterialIconButton,
        LinearProgress,
        CoverageChart, RatesChart, SynchChart,
        ReviewsByMonthChart
    },
    i18n: {
        messages: locales
    }
})
export default class Brainstorming extends Vue {

    empty: boolean = true;

    get saveID(): number {
        return this.$store.state.dia.saveID;
    }

    get canUpdate(): boolean {
        return !this.empty && this.$store.state.service.status === service.Status.idle;
    }

    get updating(): boolean {
        return this.$store.state.service.status === service.Status.queryingBrainstorming;
    }

    get idle(): boolean {
        return this.$store.state.service.status === service.Status.idle;
    }

    get progress(): number {
        return this.$store.state.progress.progress / this.$store.state.progress.max;
    }

    created() {
        this.updateData();
        Chart.register(
            ArcElement, LineElement, PointElement,
            DoughnutController, LineController, RadarController,
            RadialLinearScale, LinearScale, TimeScale,
            Filler, Tooltip, Legend
        );
        Chart.defaults.maintainAspectRatio = false;
        Chart.defaults.plugins.legend!.labels.boxWidth = 10;
        Chart.defaults.plugins.tooltip!.intersect = false;
        Chart.defaults.elements.line!.tension = 0.1;
    }

    @Watch('saveID')
    onSaved() {
        this.updateData();
    }

    async update() {
        const count = await service.updateBrainstorming();
        delibird.inform(this.$t('updateInform', { count: count }));
    }

    private async updateData() {
        const count = await dia.count();
        this.empty = count < 1;
    }
}
</script>

<style lang="scss">
.brainstorming {
    padding: 1rem;

    > div:not(:first-child) {
        margin-block-start: 0.6rem;
    }

    > .grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.6rem;

        @media screen and (min-width: 600px) {
            &--1-1-1 {
                grid-template-columns: 1fr 1fr 1fr;
            }
        }
    }
}
</style>
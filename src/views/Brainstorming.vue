<template>
<material-top-app-bar title="Brainstorming" navi-back>
    <material-icon-button v-if="canUpdate" icon="redo" @click="update" />
</material-top-app-bar>
<material-top-app-bar-adjust/>
<main v-if="!$store.getters.empty" class="brainstorming">
    <div v-if="updating" class="progress">
        <div>Updating Brainstorming</div>
        <material-linear-progress :progress="$store.state.progress" determinate/>
    </div>
    <div v-if="idle" class="grid grid--1-2">
        <coverage-chart/>
    </div>
</main>
</template>

<script lang="ts">
import {
    Chart,
    ArcElement, BarElement, LineElement, PointElement,
    BarController, DoughnutController, LineController,
    CategoryScale, LogarithmicScale, LinearScale, TimeScale,
    Tooltip, Legend
} from 'chart.js';
import 'chartjs-adapter-luxon';
import { Vue, Options } from 'vue-class-component';

import { service } from '@/service';
import { delibird } from '@/service/delibird';
import { State } from '@/store';

import MaterialIconButton from '@/components/material/IconButton.vue';
import MaterialLinearProgress from '@/components/material/LinearProgress.vue';
import MaterialTopAppBar from '@/components/material/TopAppBar.vue';
import MaterialTopAppBarAdjust from '@/components/material/TopAppBarAdjust.vue';
import CoverageChart from '@/components/brainstorming/Coverage.vue';

@Options({
    components: {
        MaterialTopAppBar, MaterialTopAppBarAdjust,
        MaterialIconButton,
        MaterialLinearProgress,
        CoverageChart
    },
})
export default class Brainstorming extends Vue {

    get canUpdate(): boolean {
        return !this.$store.getters.empty && this.$store.state.status === State.Status.idle;
    }

    created() {
        Chart.register(
            ArcElement, BarElement, LineElement, PointElement,
            BarController, DoughnutController, LineController,
            CategoryScale, LinearScale, LogarithmicScale, TimeScale,
            Tooltip, Legend
        );
        Chart.defaults.maintainAspectRatio = false;
        Chart.defaults.plugins.legend!.labels.boxWidth = 10;
        Chart.defaults.plugins.tooltip!.intersect = false;
        Chart.defaults.elements.line!.tension = 0.1;
    }

    get updating(): boolean {
        return this.$store.state.status === State.Status.queryingBrainstorming;
    }

    get idle(): boolean {
        return this.$store.state.status === State.Status.idle;
    }

    async update() {
        const count = await service.updateBrainstorming();
        delibird.inform(`Updated ${count} records`);
    }
}
</script>

<style lang="scss">
.brainstorming {
    padding: 1rem;

    > .progress {
        > .mdc-linear-progress {
            margin-block-start: 0.4em;
        }
    }

    > div:not(:first-child) {
        margin-block-start: 0.6rem;
    }

    > .grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.6rem;

        @media screen and (min-width: 600px) {
            &--1-1 {
                grid-template-columns: 1fr 1fr;
            }

            &--1-2 {
                grid-template-columns: 1fr 2fr;
            }

            &--2-1 {
                grid-template-columns: 2fr 1fr;
            }
        }
    }
}
</style>
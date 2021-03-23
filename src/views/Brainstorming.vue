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

import { State } from '@/store';

import MaterialIconButton from '@/components/material/IconButton.vue';
import MaterialLinearProgress from '@/components/material/LinearProgress.vue';
import MaterialTopAppBar from '@/components/material/TopAppBar.vue';
import MaterialTopAppBarAdjust from '@/components/material/TopAppBarAdjust.vue';
import { service } from '@/service';
import { delibird } from '@/service/delibird';

@Options({
    components: {
        MaterialTopAppBar, MaterialTopAppBarAdjust,
        MaterialIconButton,
        MaterialLinearProgress,
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
}
</style>
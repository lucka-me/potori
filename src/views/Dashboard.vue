<template>
<material-top-app-bar title="Dashboard">
    <material-icon-button v-if="canRefresh" icon="redo" @click="refresh()" />
    <material-icon-button icon="cog" @click="openPreference()" />
</material-top-app-bar>
<material-top-app-bar-adjust/>
<div class="dashboard">
    <status/>
    <hr/>
    <highlight/>
    <hr/>
    <gallery/>
    <hr/>
    <scanners/>
    <hr/>
    <reasons/>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { service } from '@/service';
import { State } from '@/store';

import MaterialIconButton from '@/components/material/IconButton.vue';
import MaterialTopAppBar from '@/components/material/TopAppBar.vue';
import MaterialTopAppBarAdjust from '@/components/material/TopAppBarAdjust.vue';
import Status from '@/components/dashboard/Status.vue';
import Highlight from '@/components/dashboard/Highlight.vue';
import Gallery from '@/components/dashboard/Gallery.vue';
import Scanners from '@/components/dashboard/Scanners.vue';
import Reasons from '@/components/dashboard/Reasons.vue';

@Options({
    components: {
        MaterialTopAppBar, MaterialTopAppBarAdjust,
        MaterialIconButton,
        Status, Highlight, Gallery, Scanners, Reasons
    },
})
export default class Dashboard extends Vue {

    get canRefresh() {
        return this.$store.state.status === State.Status.idle && this.$store.state.gapiAuthed;
    }

    refresh() {
        service.refresh();
    }

    openPreference() {
        this.$router.push({ path: '/preferences' });
    }
}
</script>

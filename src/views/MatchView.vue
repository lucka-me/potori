<template>
<material-top-app-bar title="Match" navi-back>
    <material-icon-button icon="check" @click="finish" />
</material-top-app-bar>
<material-top-app-bar-adjust/>
<main class="match-view">
    <match-pack-view v-for="(pack, index) of packs" :key="index" :pack="pack"/>
</main>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { service } from '@/service';

import MaterialIconButton from '@/components/material/IconButton.vue';
import MaterialTopAppBar from '@/components/material/TopAppBar.vue';
import MaterialTopAppBarAdjust from '@/components/material/TopAppBarAdjust.vue';
import MatchPackView from '@/components/match/Pack.vue';

@Options({
    components: {
        MaterialTopAppBar, MaterialTopAppBarAdjust,
        MaterialIconButton,
        MatchPackView
    },
})
export default class MatchView extends Vue {

    packs = service.matchData.packs;

    finish() {
        service.matchData.callback();
        this.$router.back();
    }
}
</script>

<style lang="scss">
.match-view {
    padding: 1rem;
}
</style>
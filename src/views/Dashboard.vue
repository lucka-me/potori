<template>
<material-top-app-bar :title="$t('title')">
    <material-icon-button v-if="canRefresh" icon="redo" :title="$t('refresh')" @click="refresh"/>
    <material-icon-button icon="cog" :title="$t('preferences')" @click="openPreference"/>
</material-top-app-bar>
<material-top-app-bar-adjust/>
<main class="dashboard">
    <status/>
    <highlight  v-if="!empty"/>
    <gallery    v-if="!empty"/>
    <scanners   v-if="!empty"/>
    <reasons    v-if="!empty"/>
</main>
</template>

<script lang="ts">
import { Vue, Options, Watch } from 'vue-property-decorator';

import { service } from '@/service';

import MaterialIconButton from '@/components/material/IconButton.vue';
import MaterialTopAppBar from '@/components/material/TopAppBar.vue';
import MaterialTopAppBarAdjust from '@/components/material/TopAppBarAdjust.vue';
import Status from '@/components/dashboard/Status.vue';
import Highlight from '@/components/dashboard/Highlight.vue';
import Gallery from '@/components/dashboard/Gallery.vue';
import Scanners from '@/components/dashboard/Scanners.vue';
import Reasons from '@/components/dashboard/Reasons.vue';

import locales from './Dashboard.locales.json';
import { dia } from '@/service/dia';

@Options({
    components: {
        MaterialTopAppBar, MaterialTopAppBarAdjust,
        MaterialIconButton,
        Status, Highlight, Gallery, Scanners, Reasons
    },
    i18n: {
        messages: locales
    }
})
export default class Dashboard extends Vue {

    empty: boolean = true;

    get canRefresh() {
        return this.$store.state.service.status === service.Status.idle && this.$store.state.google.authed;
    }

    get saveID(): number {
        return this.$store.state.dia.saveID;
    }

    created() {
        this.updateData();
    }

    @Watch('saveID')
    onSaved() {
        this.updateData();
    }

    refresh() {
        service.refresh();
    }

    openPreference() {
        this.$router.push({ path: '/preferences' });
    }

    private async updateData() {
        const count = await dia.count();
        this.empty = count < 1;
    }
}
</script>

<style lang="scss">
@use '~@material/typography';

.dashboard {
    padding: 1rem;

    > h2 {
        @include typography.typography(headline4);

        margin-top: 0.2em;
        margin-bottom: 0.1em;
    }

    > .card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
        gap: 0.6rem;
    }
}
</style>
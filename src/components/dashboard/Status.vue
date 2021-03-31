<template>
<div class="status">
    <div v-if="showProgress" class="progress">
        <div>{{ $t(progressText) }}</div>
        <material-linear-progress :progress="$store.state.progress.progress" :determinate="progressDeterminate"/>
    </div>
    <div v-if="showActions" class="actions">
        <material-icon-button
            v-if="showLinkButton" icon="sign-in-alt" :title="$t('link')" @click="link"/>
        <material-icon-button
            v-if="showMatchButton" icon="user-check" :title="$t('match')" @click="match"/>
        <material-icon-button
            v-if="showChartsButton" icon="chart-bar" :title="$t('charts')" @click="openCharts"/>
        <material-icon-button
            v-if="showChartsButton" icon="brain" :title="$t('brainstorming')" @click="openBrainstorming"/>
    </div>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { service } from '@/service';

import MaterialIconButton from '@/components/material/IconButton.vue';
import MaterialLinearProgress from '@/components/material/LinearProgress.vue';

import locales from './Status.locales.json';

@Options({
    components: {
        MaterialIconButton,
        MaterialLinearProgress
    },
    i18n: {
        messages: locales
    }
})
export default class Status extends Vue {

    get showProgress(): boolean {
        if (this.$store.state.service.status === service.Status.processingMails) return true;
        if (this.$store.state.service.status === service.Status.queryingBrainstorming) return true;
        if (this.$store.state.service.status === service.Status.syncing) return true;
        if (this.$store.getters.empty && !this.gapiLoaded) return true;
        return false;
    }

    get progressText(): string {
        if (this.$store.state.service.status === service.Status.processingMails) return 'processingMails';
        if (this.$store.state.service.status === service.Status.queryingBrainstorming) return 'queryingBrainstorming';
        if (this.$store.state.service.status === service.Status.syncing) return 'syncing';
        if (this.$store.getters.empty && !this.gapiLoaded) return 'loadingGAPI';
        return '';
    }

    get progressDeterminate(): boolean {
        if (this.$store.state.service.status === service.Status.processingMails) return true;
        if (this.$store.state.service.status === service.Status.queryingBrainstorming) return true;
        return false
    }

    get showLinkButton(): boolean {
        return this.gapiLoaded && !this.$store.state.google.authed;
    }

    get showMatchButton(): boolean {
        return this.$store.state.service.status === service.Status.requestMatch;
    }

    get showChartsButton(): boolean {
        return !this.$store.getters.empty;
    }

    get showActions(): boolean {
        return this.showLinkButton || this.showMatchButton || this.showChartsButton;
    }

    get idle() {
        return this.$store.state.service.status === service.Status.idle;
    }

    get gapiLoaded() {
        return this.$store.state.google.loaded;
    }

    link() {
        service.signIn();
    }

    match() {
        this.$router.push({ path: '/match' });
    }

    openCharts() {
        this.$router.push({ path: '/charts' });
    }

    openBrainstorming() {
        this.$router.push({ path: '/brainstorming' });
    }
}
</script>

<style lang="scss">
.status {
    > .actions {
        display: flex;
        flex-flow: row nowrap;
    }

    > .progress + .actions {
        margin-block-start: 0.4rem;
    }

    > .progress {
        > .mdc-linear-progress {
            margin-block-start: 0.4em;
        }
    }
}
</style>
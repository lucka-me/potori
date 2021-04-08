<template>
<div class="status">
    <linear-progress v-if="showProgress" :text="$t(progressText)" :determinate="progressDeterminate"/>
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
import { Vue, Options, Watch } from 'vue-property-decorator';

import { dia } from '@/service/dia';
import { service } from '@/service';

import MaterialIconButton from '@/components/material/IconButton.vue';
import LinearProgress from '@/components/basic/LinearProgress.vue';

import locales from './Status.locales.json';

@Options({
    components: {
        MaterialIconButton,
        LinearProgress
    },
    i18n: {
        messages: locales
    }
})
export default class Status extends Vue {

    empty: boolean = true;

    get saveID(): number {
        return this.$store.state.dia.saveID;
    }

    get showProgress(): boolean {
        const status = this.$store.state.service.status;
        if (status === service.Status.processingMails) return true;
        if (status === service.Status.queryingBrainstorming) return true;
        if (status === service.Status.syncing) return true;
        if (this.empty && !this.gapiLoaded) return true;
        return false;
    }

    get progressText(): string {
        const status = this.$store.state.service.status;
        if (status === service.Status.processingMails) return 'processingMails';
        if (status === service.Status.queryingBrainstorming) return 'queryingBrainstorming';
        if (status === service.Status.syncing) return 'syncing';
        if (this.empty && !this.gapiLoaded) return 'loadingGAPI';
        return '';
    }

    get progressDeterminate(): boolean {
        const status = this.$store.state.service.status;
        if (status === service.Status.processingMails) return this.$store.state.progress.max > 0;
        if (status === service.Status.queryingBrainstorming) return true;
        return false
    }

    get showLinkButton(): boolean {
        return this.gapiLoaded && !this.$store.state.google.authed;
    }

    get showMatchButton(): boolean {
        return this.$store.state.service.status === service.Status.requestMatch;
    }

    get showChartsButton(): boolean {
        return !this.empty;
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

    created() {
        this.updateData();
    }

    @Watch('saveID')
    onSaved() {
        this.updateData();
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

    private async updateData() {
        const count = await dia.count();
        this.empty = count < 1;
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
}
</style>
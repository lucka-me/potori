<template>
<div class="status">
    <div v-if="showProgress" class="progress">
        <div>{{ progressText }}</div>
        <material-linear-progress :progress="$store.state.progress" :determinate="progressDeterminate"/>
    </div>
    <div v-if="showActions" class="actions">
        <material-button v-if="showLinkButton" outlined @click="link">Link Google Account</material-button>
        <material-button v-if="showMatchButton" outlined @click="match">Manually Match</material-button>
        <material-button v-if="showChartsButton" outlined @click="openCharts">Charts</material-button>
    </div>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { service } from '@/service';
import { State } from '@/store';

import MaterialButton from '@/components/material/Button.vue';
import MaterialIconButton from '@/components/material/IconButton.vue';
import MaterialLinearProgress from '@/components/material/LinearProgress.vue';

@Options({
    components: {
        MaterialButton,
        MaterialIconButton,
        MaterialLinearProgress
    },
})
export default class Status extends Vue {

    get showProgress(): boolean {
        if (this.$store.state.status === State.Status.processingMails) return true;
        if (this.$store.state.status === State.Status.queryingBrainstorming) return true;
        if (this.$store.state.status === State.Status.syncing) return true;
        if (this.$store.getters.empty && !this.gapiLoaded) return true;
        return false;
    }

    get progressText(): string {
        if (this.$store.state.status === State.Status.processingMails) return 'Processing Mails';
        if (this.$store.state.status === State.Status.queryingBrainstorming) return 'Querying Brainstorming';
        if (this.$store.state.status === State.Status.syncing) return 'Syncing';
        if (this.$store.getters.empty && !this.gapiLoaded) return 'Loading Google API';
        return '';
    }

    get progressDeterminate(): boolean {
        if (this.$store.state.status === State.Status.processingMails) return true;
        if (this.$store.state.status === State.Status.queryingBrainstorming) return true;
        return false
    }

    get showLinkButton(): boolean {
        return this.gapiLoaded && !this.$store.state.gapiAuthed;
    }

    get showMatchButton(): boolean {
        return this.$store.state.status === State.Status.requestMatch;
    }

    get showChartsButton(): boolean {
        return !this.$store.getters.empty;
    }

    get showActions(): boolean {
        return this.showLinkButton || this.showMatchButton || this.showChartsButton;
    }

    get idle() {
        return this.$store.state.status === State.Status.idle;
    }

    get gapiLoaded() {
        return this.$store.state.gapiLoaded;
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
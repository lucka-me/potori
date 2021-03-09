<template>
<div class="status">
    <div v-if="processingMails">Processing Mails</div>
    <div v-else-if="syncing">Syncing</div>
    <material-button v-else-if="gapiLoaded && !authed" outlined @click="link">Link Google Account</material-button>
    <div v-else>
        Latest: XXX
    </div>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { service } from '@/service';
import { State } from '@/store';

import MaterialButton from '@/components/material/Button.vue';

@Options({
    components: {
        MaterialButton
    },
})
export default class Status extends Vue {

    get gapiLoaded() {
        return this.$store.state.gapiLoaded;
    }

    get authed() {
        return this.$store.state.gapiAuthed;
    }

    get idle() {
        return this.$store.state.status === State.Status.idle;
    }

    get processingMails() {
        return this.$store.state.status === State.Status.processingMails;
    }

    get syncing() {
        return this.$store.state.status === State.Status.syncing;
    }

    link() {
        service.signIn();
    }
}
</script>
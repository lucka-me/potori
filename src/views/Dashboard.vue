<template>
<div class="dashboard">
    Dashboard
    |
    <button v-if="canRefresh" @click="refresh()">Refresh</button>
    |
    <router-link to="/preferences">Preferences</router-link>
    <hr>
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

import Status from '@/components/dashboard/Status.vue';
import Highlight from '@/components/dashboard/Highlight.vue';
import Gallery from '@/components/dashboard/Gallery.vue';
import Scanners from '@/components/dashboard/Scanners.vue';
import Reasons from '@/components/dashboard/Reasons.vue';

@Options({
    components: {
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
}
</script>

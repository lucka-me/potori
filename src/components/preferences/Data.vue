<template>
<div class="section-title">Data</div>
<preference-row v-if="idle" text="Clear Nominations" desc="Clear all nominations from local storage">
    <material-button @click="clearNominations()">Clear</material-button>
</preference-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { service } from '@/service';
import { State } from '@/store';

import MaterialButton from '@/components/material/Button.vue';
import PreferenceRow from './Row.vue';

@Options({
    components: {
        MaterialButton,
        PreferenceRow
    },
})
export default class DataPreferences extends Vue {

    get idle() {
        return this.$store.state.status === State.Status.idle;
    }

    clearNominations() {
        service.clearNominations();
    }
}
</script>

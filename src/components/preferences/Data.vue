<template>
<h2>Data</h2>
<preference-row v-if="idle" text="Import Nominations" desc="Import nominations from file">
    <material-button @click="importNominations">Import</material-button>
</preference-row>
<preference-row v-if="idle" text="Export Nominations" desc="Export nominations to file">
    <material-button @click="exportNominations">Export</material-button>
</preference-row>
<preference-row v-if="idle" text="Import Wayfarer JSON" desc="Export JSON from https://wayfarer.nianticlabs.com/api/v1/vault/manage">
    <material-button @click="importWayfarerJSON">Import</material-button>
</preference-row>
<preference-row v-if="idle" text="Clear Nominations" desc="Clear all nominations from local storage">
    <material-button @click="clearNominations">Clear</material-button>
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

    importNominations() {
        service.importNominationsFile();
    }

    exportNominations() {
        service.exportNominationsFile();
    }

    importWayfarerJSON() {
        const text = window.prompt('Paste Wayfarer JSON');
        if (!text) return;
        service.importWayfarerJSON(text);
    }

    clearNominations() {
        service.clearNominations();
    }
}
</script>

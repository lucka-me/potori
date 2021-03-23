<template>
<h2>Brainstorming</h2>
<preference-row text="Automatically Query Firebase" desc="Query Firebase to get locations after processing mails">
    <material-switch v-model="autoQueryFirebase"/>
</preference-row>
<preference-row text="Import Database" desc="Import records from file">
    <material-button @click="importRecords">Import</material-button>
</preference-row>
<preference-row text="Export Database" desc="Export records to file">
    <material-button @click="exportRecords">Export</material-button>
</preference-row>
<preference-row text="Clear Database" desc="Clear all records from local storage">
    <material-button @click="clear">Clear</material-button>
</preference-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { brainstorming } from '@/service/brainstorming';
import { preferences } from '@/service/preferences';

import MaterialButton from '@/components/material/Button.vue';
import MaterialSwitch from '@/components/material/Switch.vue';
import PreferenceRow from './Row.vue';

@Options({
    components: {
        MaterialButton, MaterialSwitch,
        PreferenceRow
    },
})
export default class BrainstormingPreferences extends Vue {

    get autoQueryFirebase(): boolean {
        return preferences.brainstorming.autoQueryFirebase();
    }

    set autoQueryFirebase(value: boolean) {
        preferences.brainstorming.setAutoQueryFirebase(value);
    }

    importRecords() {
        brainstorming.importDatabase();
    }

    exportRecords() {
        brainstorming.exportDatabase();
    }

    clear() {
        brainstorming.clear();
    }
}
</script>

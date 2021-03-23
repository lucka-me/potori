<template>
<h2>Brainstorming</h2>
<preference-row text="Automatically Query Firebase" desc="Query Firebase to get locations after processing mails">
    <material-switch v-model="autoQueryFirebase"/>
</preference-row>
<preference-row text="Import Database" desc="Import records from file">
    <material-button @click="importDatabase">Import</material-button>
</preference-row>
<preference-row text="Export Database" desc="Export records to file">
    <material-button @click="exportDatabase">Export</material-button>
</preference-row>
<preference-row text="Clear Database" desc="Clear all records from local storage">
    <material-button @click="clear">Clear</material-button>
</preference-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { brainstorming } from '@/service/brainstorming';
import { delibird } from '@/service/delibird';
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

    async importDatabase() {
        const count = await brainstorming.importDatabase();
        delibird.inform(`Imported ${count} records`);
    }

    async exportDatabase() {
        const count = await brainstorming.exportDatabase();
        delibird.inform(`Exported ${count} records`);
    }

    clear() {
        brainstorming.clear();
    }
}
</script>

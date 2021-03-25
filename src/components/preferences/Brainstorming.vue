<template>
<h2>{{ $t('header') }}</h2>
<preference-row :text="$t('autoQueryFirebase')" :desc="$t('autoQueryFirebaseDesc')">
    <material-switch v-model="autoQueryFirebase"/>
</preference-row>
<preference-row :text="$t('importDatabase')" :desc="$t('importDatabaseDesc')">
    <material-button @click="importDatabase">{{ $t('importAction') }}</material-button>
</preference-row>
<preference-row :text="$t('exportDatabase')" :desc="$t('exportDatabaseDesc')">
    <material-button @click="exportDatabase">{{ $t('exportAction') }}</material-button>
</preference-row>
<preference-row :text="$t('clearDatabase')" :desc="$t('clearDatabaseDesc')">
    <material-button @click="clear">{{ $t('clearAction') }}</material-button>
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

import locales from './Brainstorming.locales.json';

@Options({
    components: {
        MaterialButton, MaterialSwitch,
        PreferenceRow
    },
    i18n: {
        messages: locales
    }
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
        delibird.inform(this.$t('importDatabaseInform', { count: count }));
    }

    async exportDatabase() {
        const count = await brainstorming.exportDatabase();
        delibird.inform(this.$t('exportDatabaseInform', { count: count }));
    }

    clear() {
        brainstorming.clear();
    }
}
</script>

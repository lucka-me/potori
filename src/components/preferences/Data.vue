<template>
<h2>{{ $t('header') }}</h2>
<preference-row v-if="idle" :text="$t('importNominations')" :desc="$t('importNominationsDesc')">
    <material-button @click="importNominations">{{ $t('importAction') }}</material-button>
</preference-row>
<preference-row v-if="idle" :text="$t('exportNominations')" :desc="$t('exportNominationsDesc')">
    <material-button @click="exportNominations">{{ $t('exportAction') }}</material-button>
</preference-row>
<preference-row v-if="idle" :text="$t('importWayfarer')" :desc="$t('importWayfarerDesc')">
    <material-button @click="importWayfarerJSON">{{ $t('importAction') }}</material-button>
</preference-row>
<preference-row v-if="idle" :text="$t('clearNominations')" :desc="$t('clearNominationsDesc')">
    <material-button @click="clearNominations">{{ $t('clearAction') }}</material-button>
</preference-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { delibird } from '@/service/delibird';
import { dia } from '@/service/dia';
import { service } from '@/service';

import MaterialButton from '@/components/material/Button.vue';
import PreferenceRow from './Row.vue';

import locales from './Data.locales.json';

@Options({
    components: {
        MaterialButton,
        PreferenceRow
    },
    i18n: {
        messages: locales
    }
})
export default class DataPreferences extends Vue {

    get idle() {
        return this.$store.state.service.status === service.Status.idle;
    }

    async importNominations() {
        const count = await service.importNominationsFile();
        delibird.inform(this.$t('importNominationsInform', { count: count}));
    }

    exportNominations() {
        service.exportNominationsFile();
    }

    async importWayfarerJSON() {
        const text = window.prompt(this.$t('importWayfarerPrompt'));
        if (!text) return;
        const result = await service.importWayfarerJSON(text);
        switch (result) {
            case -1:
                delibird.alert(this.$t('importWayfarerAlertParseError'));
                break;
            case -2:
                delibird.alert(this.$t('importWayfarerAlertDataInvalid'))
                break;
            default:
                delibird.inform(this.$t('importWayfarerInform', { count: result }));
                break;
        }
    }

    clearNominations() {
        dia.clear();
    }
}
</script>

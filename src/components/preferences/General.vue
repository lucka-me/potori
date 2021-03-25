<template>
<h2>{{ $t('header') }}</h2>
<preference-row :text="$t('queryAfterLatest')" :desc="$t('queryAfterLatestDesc')">
    <material-switch v-model="queryAfterLatest"/>
</preference-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { preferences } from '@/service/preferences';

import MaterialSwitch from '@/components/material/Switch.vue';
import PreferenceRow from './Row.vue';

import locales from './General.locales.json';

@Options({
    components: {
        MaterialSwitch,
        PreferenceRow
    },
    i18n: {
        messages: locales
    }
})
export default class GeneralPreferences extends Vue {

    get queryAfterLatest(): boolean {
        return preferences.general.queryAfterLatest();
    }

    set queryAfterLatest(value: boolean) {
        preferences.general.setQueryAfterLatest(value);
    }
}
</script>

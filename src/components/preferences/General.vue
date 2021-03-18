<template>
<h2>General</h2>
<preference-row text="Query After Latest" desc="Query mails received after the latest one">
    <material-switch v-model="queryAfterLatest"/>
</preference-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { preferences } from '@/service/preferences';

import MaterialSwitch from '@/components/material/Switch.vue';
import PreferenceRow from './Row.vue';

@Options({
    components: {
        MaterialSwitch,
        PreferenceRow
    },
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

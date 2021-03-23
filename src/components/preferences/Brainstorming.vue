<template>
<h2>Brainstorming</h2>
<preference-row text="Automatically Query Firebase" desc="Query Firebase to get locations after processing mails">
    <material-switch v-model="autoQueryFirebase"/>
</preference-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

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
}
</script>

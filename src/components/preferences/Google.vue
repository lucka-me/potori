<template>
<div class="section-title">Google</div>
<preference-row v-if="loaded" text="Account" desc="Link / unlink Google Account">
    <material-button v-if="authed" @click="signOut()">Unlink</material-button>
    <material-button v-else @click="signIn()">Link</material-button>
</preference-row>
<preference-row v-if="authed" text="Sync Google Drive" desc="Sync with Google Drive when refresh">
    <material-switch v-model="sync"/>
</preference-row>
<div v-if="!loaded">Loading Google API</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { service } from '@/service';
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
export default class GooglePreferences extends Vue {

    get loaded() {
        return this.$store.state.gapiLoaded;
    }

    get authed() {
        return this.$store.state.gapiAuthed;
    }

    get sync(): boolean {
        return preferences.google.sync();
    }

    set sync(value: boolean) {
        preferences.google.setSync(value);
    }

    signIn() {
        service.signIn();
    }

    signOut() {
        service.signOut();
    }

}
</script>

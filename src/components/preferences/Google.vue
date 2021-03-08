<template>
<div class="section-title">Google</div>
<preference-row v-if="gapiLoaded" text="Account" desc="Link / unlink Google Account">
    <material-button v-if="authed" @click="signOut()">Unlink</material-button>
    <material-button v-else @click="signIn()">Link</material-button>
</preference-row>
<div v-if="gapiLoaded">
    <input type="checkbox" id="pref-google-sync" v-model="googleSync">
    <label for="pref-google-sync">Sync Google Drive</label>
</div>
<div v-else>Loading Google API</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { service } from '@/service';
import { preferences } from '@/service/preferences';

import MaterialButton from '@/components/material/Button.vue';
import PreferenceRow from './Row.vue';

@Options({
    components: {
        MaterialButton,
        PreferenceRow
    },
})
export default class GooglePreferences extends Vue {

    get gapiLoaded() {
        return this.$store.state.gapiLoaded;
    }

    get authed() {
        return this.$store.state.gapiAuthed;
    }

    get googleSync() {
        return preferences.google.sync();
    }

    set googleSync(value: boolean) {
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

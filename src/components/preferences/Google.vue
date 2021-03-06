<template>
<div>
    <div>Google</div>
    <div v-if="gapiLoaded">
        <button v-if="authed" @click="signOut()">Sign Out</button>
        <button v-else @click="signIn()">Sign In</button>
        <div>
            <input type="checkbox" id="pref-google-sync" v-model="googleSync">
            <label for="pref-google-sync">Sync Google Drive</label>
        </div>
    </div>
    <div v-else>Loading Google API</div>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { service } from '@/service';
import { preferences } from '@/service/preferences';

@Options({
    components: {
        
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

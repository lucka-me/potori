<template>
<div class="section-title">Google</div>
<preference-row v-if="loaded" text="Account" desc="Link / unlink Google Account">
    <material-button v-if="authed" @click="unlink()">Unlink</material-button>
    <material-button v-else @click="link()">Link</material-button>
</preference-row>
<preference-row v-if="authed" text="Sync Google Drive" desc="Sync with Google Drive when refresh">
    <material-switch v-model="sync"/>
</preference-row>
<preference-row v-if="authed" text="Migrate" desc="Migrate data from Potori before 0.8.0">
    <material-button @click="migrate()">Migrate</material-button>
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

    link() {
        service.signIn();
    }

    unlink() {
        service.signOut();
    }

    migrate() {
        service.migrate();
    }
}
</script>

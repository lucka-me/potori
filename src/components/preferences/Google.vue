<template>
<h2>{{ $t('header') }}</h2>
<preference-row v-if="loaded" :text="$t('account')" :desc="$t('accountDesc')">
    <material-button v-if="authed" @click="unlink">{{ $t('unlink') }}</material-button>
    <material-button v-else @click="link">{{ $t('link') }}</material-button>
</preference-row>
<preference-row v-if="authed && idle" :text="$t('sync')" :desc="$t('syncDesc')">
    <material-switch v-model="sync"/>
</preference-row>
<preference-row v-if="authed && idle" :text="$t('syncNow')" :desc="$t('syncNowDesc')">
    <material-button @click="doSync">{{ $t('syncNowAction') }}</material-button>
</preference-row>
<preference-row v-if="authed && idle" :text="$t('uploadNow')" :desc="$t('uploadNowDesc')">
    <material-button @click="upload">{{ $t('uploadNowAction') }}</material-button>
</preference-row>
<preference-row v-if="authed && idle" :text="$t('migrate')" :desc="$t('migrateDesc')">
    <material-button @click="migrate">{{ $t('migrate') }}</material-button>
</preference-row>
<preference-row v-if="!loaded" :text="$t('loadingGAPI')"/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { service } from '@/service';
import { delibird } from '@/service/delibird';
import { preferences } from '@/service/preferences';

import MaterialButton from '@/components/material/Button.vue';
import MaterialSwitch from '@/components/material/Switch.vue';
import PreferenceRow from './Row.vue';

import locales from './Google.locales.json';

@Options({
    components: {
        MaterialButton, MaterialSwitch,
        PreferenceRow
    },
    i18n: {
        messages: locales
    }
})
export default class GooglePreferences extends Vue {

    get loaded() {
        return this.$store.state.google.loaded;
    }

    get authed() {
        return this.$store.state.google.authed;
    }

    get idle() {
        return this.$store.state.service.status === service.Status.idle;
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

    doSync() {
        service.sync();
    }

    upload() {
        service.upload();
    }

    migrate() {
        service.migrate((count) => {
            delibird.inform(`Migrated ${count} nominations.`);
        });
    }
}
</script>

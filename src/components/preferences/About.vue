<template>
<h2>About</h2>
<preference-row text="App Version" :desc="appVersion"/>
<preference-row text="Data Version" :desc="dataVersion"/>
<preference-row text="Code Repository" desc="GitHub">
    <material-button @click="openRepo">Open</material-button>
</preference-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { version } from '@/service/version';

import MaterialButton from '@/components/material/Button.vue';
import PreferenceRow from './Row.vue';

@Options({
    components: {
        MaterialButton,
        PreferenceRow
    },
})
export default class AboutPreferences extends Vue {
    get appVersion() {
        return version.text;
    }

    get dataVersion() {
        return version.data;
    }

    openRepo() {
        window.open('https://github.com/lucka-me/potori', '_blank');
    }
}
</script>

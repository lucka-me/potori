<template>
<h2>About</h2>
<preference-row text="App Version" :desc="appVersion"/>
<preference-row text="Data Version" :desc="dataVersion"/>
<preference-row text="Document">
    <material-button @click="openDoc">Open</material-button>
</preference-row>
<preference-row text="Code Repository" desc="GitHub">
    <material-button @click="openRepo">Open</material-button>
</preference-row>
<preference-row v-if="hasErrors" text="Export Errors" desc="Export errors logged by Potori">
    <material-button @click="exportErrors">Export</material-button>
</preference-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { delibird } from '@/service/delibird';
import { service } from '@/service';
import { util } from '@/service/utils';
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

    get hasErrors(): boolean {
        return service.errors.length > 0;
    }

    openDoc() {
        window.open('/docs', '_blank');
    }

    openRepo() {
        window.open('https://github.com/lucka-me/potori', '_blank');
    }

    exportErrors() {
        let message = '';
        for (const error of service.errors) {
            let details = error.message;
            if ('message' in error.error) {
                const typedError = error.error as Error;
                details = typedError.stack || typedError.message;
            }
            message += `[${error.filename}][${error.lineno}:${error.colno}]${details}\n`;
        }
        util.copy(message);
        delibird.inform(`Copied ${service.errors.length} errors to clipboard.`);
    }
}
</script>

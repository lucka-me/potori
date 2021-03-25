<template>
<h2>{{ $t('header') }}</h2>
<preference-row :text="$t('appVersion')" :desc="appVersion"/>
<preference-row :text="$t('dataVersion')" :desc="dataVersion"/>
<preference-row :text="$t('document')">
    <material-button @click="openDoc">{{ $t('openAction') }}</material-button>
</preference-row>
<preference-row :text="$t('repository')" :desc="$t('repositoryDesc')">
    <material-button @click="openRepo">{{ $t('openAction') }}</material-button>
</preference-row>
<preference-row v-if="hasErrors" :text="$t('exportErrors')" :desc="$t('exportErrorsDesc')">
    <material-button @click="exportErrors">{{ $t('exportErrorsAction') }}</material-button>
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

import locales from './About.locales.json';

@Options({
    components: {
        MaterialButton,
        PreferenceRow
    },
    i18n: {
        messages: locales
    }
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
        delibird.inform(this.$t('exportErrorsInform', { count: service.errors.length }));
    }
}
</script>

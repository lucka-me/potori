<template>
<router-view/>
<material-dialog v-model="alertOpen">{{ alertMessage }}</material-dialog>
<material-snackbar :message="informMessage" v-model="informOpen"/>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { Vue, Options } from 'vue-property-decorator';

import { delibird } from './service/delibird';

import MaterialDialog from '@/components/material/Dialog.vue';
import MaterialSnackbar from '@/components/material/Snackbar.vue';

@Options({
    components: {
        MaterialDialog,
        MaterialSnackbar
    }
})
export default class App extends Vue {

    alertMessage: string = '';
    alertOpen: boolean = false;

    informMessage: string = '';
    informOpen: boolean = false;

    mounted() {
        delibird.events.alert = (message) => {
            this.alertMessage = message;
            this.alertOpen = true;
        };
        delibird.events.inform = (message) => {
            this.informMessage = message;
            this.informOpen = true;
        };
    }
}
</script>

<style lang="scss">
@use './variables';
@use '@material/theme' with (
    $primary: variables.$primary,
    $secondary: variables.$secondary,
);
@use '~@material/typography';
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap');

@include theme.core-styles;

html {
    // Fix for iOS standalone mode
    height: calc(100% + env(safe-area-inset-top, 0));
}

body, #app {
    margin: 0;
    height: 100%;
}

#app {
    @include typography.base();
    display: flex;
    flex-flow: column nowrap;

    > main:not(.ignore-safe-area) {
        margin-bottom: env(safe-area-inset-bottom);
        margin-left: env(safe-area-inset-left);
        margin-right: env(safe-area-inset-right);
    }
}
</style>

<template>
<router-view/>
<material-snackbar :message="informMessage" v-model="informOpen"/>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-property-decorator';

import { delibird } from './service/delibird';

import MaterialSnackbar from '@/components/material/Snackbar.vue';

@Options({
    components: {
        MaterialSnackbar
    }
})
export default class App extends Vue {

    informMessage: string = '';
    informOpen: boolean = false;

    mounted() {
        delibird.events.inform = (message) => {
            this.informMessage = message;
            this.informOpen = true;
        }
    }
}
</script>

<style lang="scss">
@use '~@material/typography';
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap');

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

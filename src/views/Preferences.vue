<template>
<material-top-app-bar title="Preferences" navi-back/>
<material-top-app-bar-adjust/>
<main class="preferences">
    <general-preferences/>
    <hr/>
    <google-preferences/>
    <hr/>
    <data-preferences/>
    <hr/>
    <brainstorming-preferences/>
    <hr/>
    <about-preferences/>
</main>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import MaterialTopAppBar from '@/components/material/TopAppBar.vue';
import MaterialTopAppBarAdjust from '@/components/material/TopAppBarAdjust.vue';
import AboutPreferences from '@/components/preferences/About.vue';
import BrainstormingPreferences from '@/components/preferences/Brainstorming.vue';
import DataPreferences from '@/components/preferences/Data.vue';
import GeneralPreferences from '@/components/preferences/General.vue';
import GooglePreferences from '@/components/preferences/Google.vue';

@Options({
    components: {
        MaterialTopAppBar, MaterialTopAppBarAdjust,
        GeneralPreferences,
        GooglePreferences,
        BrainstormingPreferences,
        DataPreferences,
        AboutPreferences,
    },
})
export default class Preferences extends Vue {}
</script>

<style lang="scss">
@use '~@material/theme';
@use '~@material/typography';

.preferences {
    padding: 1rem;

    > h2 {
        @include typography.typography(overline);
        margin: 0;
    }

    > hr {
        border: none;
        height: 1px;
        border-top: 1px solid;
        @include theme.property(border-top-color, text-secondary-on-light);
        margin-inline-start: -1rem;
        margin-inline-end: -1rem;
    }
}
</style>
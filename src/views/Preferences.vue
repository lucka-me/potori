<template>
<material-top-app-bar title="Preferences" navi-back/>
<material-top-app-bar-adjust/>
<div class="preferences">
    <google-preferences/>
    <hr/>
    <about-preferences/>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import MaterialTopAppBar from '@/components/material/TopAppBar.vue';
import MaterialTopAppBarAdjust from '@/components/material/TopAppBarAdjust.vue';
import AboutPreferences from '@/components/preferences/About.vue';
import GooglePreferences from '@/components/preferences/Google.vue';

@Options({
    components: {
        MaterialTopAppBar, MaterialTopAppBarAdjust,
        AboutPreferences,
        GooglePreferences
    },
})
export default class Preferences extends Vue {}
</script>

<style lang="scss">
@use '~@material/theme';
@use '~@material/typography';

.preferences {
    padding: 1rem;

    > .section-title {
        @include typography.typography(overline);
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
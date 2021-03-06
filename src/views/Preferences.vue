<template>
<material-top-app-bar title="Preferences" navi-back/>
<material-top-app-bar-adjust/>
<div class="preferences">
    Preferences
    <router-link to="../">Back</router-link>
    <hr/>
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

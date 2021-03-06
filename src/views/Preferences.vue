<template>
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

import AboutPreferences from '@/components/preferences/About.vue';
import GooglePreferences from '@/components/preferences/Google.vue';

@Options({
    components: {
        AboutPreferences,
        GooglePreferences
    },
})
export default class Preferences extends Vue {}
</script>

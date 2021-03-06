<template>
<div class="preferences">
    Preferences
    <router-link to="../">Back</router-link>
    <!--<hr/>
    <google-preferences/>-->
    <hr/>
    <about-preferences/>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

// import GooglePreferences from '@/components/preferences/Google.vue';
import AboutPreferences from '@/components/preferences/About.vue';

@Options({
    components: {
        // GooglePreferences,
        AboutPreferences
    },
})
export default class Preferences extends Vue {}
</script>

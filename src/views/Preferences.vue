<template>
<div class="preferences">
    Preferences
    <router-link to="../">Back</router-link>
    <hr/>
    <about-preferences/>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import AboutPreferences from '@/components/preferences/About.vue';

@Options({
    components: {
        AboutPreferences
    },
})
export default class Preferences extends Vue {}
</script>

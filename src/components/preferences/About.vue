<template>
<div>
    <div>About</div>
    <div>App Version: {{ appVersion }}</div>
    <div>Data Version: {{ dataVersion }}</div>
    <div><a href="https://github.com/lucka-me/potori">Code Repository</a></div>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { version } from '@/service/version';

@Options({
    components: {
        
    },
})
export default class AboutPreferences extends Vue {
    get appVersion() {
        return version.text;
    }

    get dataVersion() {
        return version.data;
    }
}
</script>

<template>
<material-top-app-bar title="Charts" navi-back/>
<material-top-app-bar-adjust/>
<main class="charts">
</main>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

import MaterialTopAppBar from '@/components/material/TopAppBar.vue';
import MaterialTopAppBarAdjust from '@/components/material/TopAppBarAdjust.vue';

@Options({
    components: {
        MaterialTopAppBar, MaterialTopAppBarAdjust,
    },
})
export default class Charts extends Vue {
}
</script>

<style lang="scss">
.charts {
    padding: 1rem;
}
</style>
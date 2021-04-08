<template>
<div class="mdc-top-app-bar--fixed-adjust"/>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class MaterialTopAppBarAdjust extends Vue {}
</script>

<style lang="scss">
.mdc-top-app-bar--fixed-adjust {
    height: env(safe-area-inset-top);
    min-height: env(safe-area-inset-top);
}
</style>
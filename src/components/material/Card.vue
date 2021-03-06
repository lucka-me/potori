<template>
<div class="mdc-card mdc-card--outlined">
    <div class="mdc-card__primary-action">
        <slot/>
    </div>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    props: {
        
    },
    components: {
        
    },
})
export default class MaterialCard extends Vue {}
</script>

<style lang="scss">
@use '~@material/card';

@include card.core-styles;
</style>
<template>
<div class="mdc-card mdc-card--outlined">
    <div class="mdc-card__primary-action">
        <div v-if="image" class="mdc-card__media mdc-card__media--16-9" :style="style"/>
        <slot/>
    </div>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    props: {
        image: String
    },
    components: {
        
    },
})
export default class MaterialCard extends Vue {

    image?: string;

    get style(): string {
        if (!this.image) return '';
        return `background-image: url("${this.image}")`;
    }
}
</script>

<style lang="scss">
@use '~@material/card';

@include card.core-styles;
</style>
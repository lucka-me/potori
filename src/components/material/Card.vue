<template>
<div class="mdc-card mdc-card--outlined">
    <div class="mdc-card__primary-action">
        <div v-if="image" :class="mediaClassName" :style="mediaStyle"/>
        <slot/>
    </div>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    props: {
        image: String,
        squareImage: Boolean
    },
    components: {
        
    },
})
export default class MaterialCard extends Vue {

    image?: string;
    squareImage?: boolean;

    get mediaClassName(): string {
        return `mdc-card__media mdc-card__media--${this.squareImage ? 'square' : '16-9'}`;
    }

    get mediaStyle(): string {
        if (!this.image) return '';
        return `background-image: url("${this.image}")`;
    }
}
</script>

<style lang="scss">
@use '~@material/card';

@include card.core-styles;
</style>
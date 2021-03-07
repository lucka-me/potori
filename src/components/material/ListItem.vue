<template>
<li class="mdc-list-item">
    <span class="mdc-list-item__ripple"></span>
    <span v-if="$slots.leading" class="mdc-list-item__graphic">
        <slot name="leading"/>
    </span>
    <span v-if="secondary" class="mdc-list-item__text">
        <span  class="mdc-list-item__primary-text">{{ text }}</span>
        <span class="mdc-list-item__secondary-text">{{ secondary }}</span>
    </span>
    <span v-else class="mdc-list-item__text">{{ text }}</span>
    <span v-if="$slots.meta" class="mdc-list-item__meta">
        <slot name="meta"/>
    </span>
</li>
</template>

<script lang="ts">
import { MDCRipple } from '@material/ripple';
import { Options, Vue } from 'vue-class-component';

@Options({
    props: {
        text: String,
        secondary: String,
    },
    components: {
        
    },
})
export default class MaterialList extends Vue {

    private ctrl?: MDCRipple;

    twoLine!: Boolean

    get className() {
        return this.twoLine ? 'mdc-list mdc-list--two-line' : 'mdc-list';
    }

    mounted() {
        this.ctrl = MDCRipple.attachTo(this.$el);
    }

    updated() {
        this.ctrl?.destroy();
        this.ctrl = MDCRipple.attachTo(this.$el);
    }

    unmounted() {
        this.ctrl?.destroy();
    }
}
</script>

<style lang="scss">

</style>
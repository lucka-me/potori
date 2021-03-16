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
import { Vue, Prop } from 'vue-property-decorator';

export default class MaterialList extends Vue {

    @Prop(String) readonly text!: String;
    @Prop(String) readonly secondary?: String;

    private ctrl?: MDCRipple;

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
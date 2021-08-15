<template>
<li class="mdc-list-item mdc-list-item--with-two-lines mdc-list-item--with-leading-image mdc-list-item--with-trailing-icon">
    <span class="mdc-list-item__ripple"></span>
    <span v-if="$slots.leading" class="mdc-list-item__start">
        <slot name="leading"/>
    </span>
    <span v-if="secondary" class="mdc-list-item__content">
        <span class="mdc-list-item__primary-text">{{ text }}</span>
        <span class="mdc-list-item__secondary-text">{{ secondary }}</span>
    </span>
    <span v-else class="mdc-list-item__content">{{ text }}</span>
    <span v-if="$slots.meta" class="mdc-list-item__end">
        <slot name="meta"/>
    </span>
</li>
</template>

<script lang="ts">
import { MDCRipple } from '@material/ripple';
import { Vue, Prop } from 'vue-property-decorator';

export default class MaterialListItem extends Vue {

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
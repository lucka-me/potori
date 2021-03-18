<template>
<div class="mdc-form-field">
    <slot/>
</div>
</template>

<script lang="ts">
import { MDCFormField } from '@material/form-field';
import { Vue } from 'vue-class-component';

export default class MaterialFormField extends Vue {

    private ctrl?: MDCFormField;

    mounted() {
        this.ctrl = MDCFormField.attachTo(this.$el);
    }

    updated() {
        this.ctrl?.destroy();
        this.ctrl = MDCFormField.attachTo(this.$el);
    }

    unmounted() {
        this.ctrl?.destroy();
    }
}
</script>

<style lang="scss">
@use "@material/form-field";

@include form-field.core-styles;
</style>
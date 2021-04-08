<template>
<label class="mdc-text-field mdc-text-field--outlined">
    <span class="mdc-notched-outline">
        <span class="mdc-notched-outline__leading"></span>
        <span class="mdc-notched-outline__notch">
            <span class="mdc-floating-label" :id="inputId">{{ label }}</span>
        </span>
        <span class="mdc-notched-outline__trailing"></span>
    </span>
    <input
        :type="type" class="mdc-text-field__input"
        :aria-labelledby="inputId"
        :pattern="pattern"
        :required="required"
    >
</label>
</template>

<script lang="ts">
import { MDCTextField } from '@material/textfield';
import { Vue, Model, Prop } from 'vue-property-decorator';

export default class MaterialTextfield extends Vue {

    @Model('modelValue', { type: String, default: '' }) readonly value!: string;
    @Prop(String) readonly label!: string;
    @Prop({ type: String, default: 'text' }) readonly type!: string;
    @Prop(String) readonly inputId?: string;
    @Prop(String) readonly pattern?: string;
    @Prop(Boolean) readonly required?: boolean;

    private ctrl?: MDCTextField;

    mounted() {
        this.ctrl = MDCTextField.attachTo(this.$el);
        this.ctrl.value = this.value;
        this.ctrl.listen('change', this.changed);
    }

    updated() {
        this.ctrl?.destroy();
        this.ctrl = MDCTextField.attachTo(this.$el);
        this.ctrl.value = this.value;
        this.ctrl.listen('change', this.changed);
    }

    unmounted() {
        this.ctrl?.destroy();
    }

    private changed() {
        if (!this.ctrl || !this.ctrl.valid) return;
        this.$emit('update:modelValue', this.ctrl.value);
    }
}
</script>

<style lang="scss">
@use "@material/floating-label/mdc-floating-label";
@use "@material/line-ripple/mdc-line-ripple";
@use "@material/notched-outline/mdc-notched-outline";
@use "@material/textfield";

@include textfield.core-styles;
</style>
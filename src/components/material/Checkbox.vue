<template>
<div class="mdc-checkbox">
    <input type="checkbox"
           class="mdc-checkbox__native-control"
           :id="inputId"/>
    <div class="mdc-checkbox__background">
        <svg class="mdc-checkbox__checkmark"
            viewBox="0 0 24 24">
            <path class="mdc-checkbox__checkmark-path"
                fill="none"
                d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
        </svg>
        <div class="mdc-checkbox__mixedmark"></div>
    </div>
    <div class="mdc-checkbox__ripple"></div>
</div>
</template>

<script lang="ts">
import { MDCCheckbox } from '@material/checkbox';
import { Vue, Model, Prop } from 'vue-property-decorator';

export default class MaterialSwitch extends Vue {

    @Model('modelValue', { type: Boolean, default: false }) readonly value!: boolean;
    @Prop(String) readonly inputId?: string;

    private ctrl?: MDCCheckbox;

    mounted() {
        this.ctrl = MDCCheckbox.attachTo(this.$el);
        this.ctrl.checked = this.value;
        this.ctrl.listen('change', this.changed);
    }

    updated() {
        this.ctrl?.destroy();
        this.ctrl = MDCCheckbox.attachTo(this.$el);
        this.ctrl.checked = this.value;
        this.ctrl.listen('change', this.changed);
    }

    unmounted() {
        this.ctrl?.destroy();
    }

    private changed() {
        if (!this.ctrl) return;
        this.$emit('update:modelValue', this.ctrl.checked);
    }
}
</script>

<style lang="scss">
@use "@material/checkbox";

@include checkbox.core-styles;
</style>
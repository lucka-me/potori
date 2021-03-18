<template>
<div class="mdc-radio">
    <input class="mdc-radio__native-control" type="radio" :id="inputId" :name="inputName">
    <div class="mdc-radio__background">
      <div class="mdc-radio__outer-circle"></div>
      <div class="mdc-radio__inner-circle"></div>
    </div>
    <div class="mdc-radio__ripple"></div>
</div>
</template>

<script lang="ts">
import { MDCRadio } from '@material/radio';
import { Vue, Model, Prop } from 'vue-property-decorator';

export default class MaterialSwitch extends Vue {

    @Model('modelValue', { type: Boolean, default: false }) readonly value!: boolean;
    @Prop(String) readonly inputId?: string;
    @Prop(String) readonly inputName?: string;

    private ctrl?: MDCRadio;

    mounted() {
        this.ctrl = MDCRadio.attachTo(this.$el);
        this.ctrl.checked = this.value;
        this.ctrl.listen('change', this.changed);
    }

    updated() {
        this.ctrl?.destroy();
        this.ctrl = MDCRadio.attachTo(this.$el);
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
@use "@material/radio/styles";
</style>
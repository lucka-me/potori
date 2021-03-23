<template>
<div class="mdc-switch">
    <div class="mdc-switch__track"></div>
    <div class="mdc-switch__thumb-underlay">
        <div class="mdc-switch__thumb"></div>
        <input type="checkbox" class="mdc-switch__native-control" role="switch"/>
    </div>
</div>
</template>

<script lang="ts">
import { MDCSwitch } from '@material/switch';
import { Vue, Model, Watch } from 'vue-property-decorator';

export default class MaterialSwitch extends Vue {

    @Model('modelValue', { type: Boolean, default: false }) readonly value!: boolean;

    private ctrl?: MDCSwitch;

    @Watch('value')
    onValueChanged(newVal: boolean, _: string) {
        if (!this.ctrl) return;
        this.ctrl.checked = newVal
    }

    mounted() {
        this.ctrl = MDCSwitch.attachTo(this.$el);
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
@use "@material/switch";

@include switch.core-styles;

.mdc-switch {
    margin: 1rem;
}
</style>
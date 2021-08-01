<template>
<button class="mdc-switch" type="button" role="switch" @click="changed()">
    <div class="mdc-switch__track"></div>
    <div class="mdc-switch__handle-track">
        <div class="mdc-switch__handle">
            <div class="mdc-switch__shadow">
                <div class="mdc-elevation-overlay"></div>
            </div>
            <div class="mdc-switch__ripple"></div>
            <div class="mdc-switch__icons">
                <svg class="mdc-switch__icon mdc-switch__icon--on" viewBox="0 0 24 24">
                    <path d="M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z" />
                </svg>
                <svg class="mdc-switch__icon mdc-switch__icon--off" viewBox="0 0 24 24">
                    <path d="M20 13H4v-2h16v2z" />
                </svg>
            </div>
        </div>
    </div>
</button>
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
        this.ctrl.selected = newVal;
    }

    mounted() {
        this.ctrl = MDCSwitch.attachTo(this.$el);
        this.ctrl.selected = this.value;
        console.log(`mounted ${this.ctrl.selected}`);
    }

    unmounted() {
        this.ctrl?.destroy();
    }

    changed() {
        if (!this.ctrl) return;
        this.$emit('update:modelValue', !this.ctrl.selected);
    }
}
</script>

<style lang="scss">
@use '@material/switch/styles';

.mdc-switch {
    margin: 1rem;
}
</style>
<template>
<aside class="mdc-snackbar">
    <div class="mdc-snackbar__surface" role="status" aria-relevant="additions">
        <div class="mdc-snackbar__label" aria-atomic="false"></div>
        <div class="mdc-snackbar__actions" aria-atomic="true">
            <material-icon-button class="mdc-snackbar__dismiss" icon="times"/>
        </div>
    </div>
</aside>
</template>

<script lang="ts">
import { MDCSnackbar } from '@material/snackbar';
import { Vue, Model, Options, Prop, Watch } from 'vue-property-decorator';

import MaterialIconButton from './IconButton.vue';

@Options({
    components: {
        MaterialIconButton
    }
})
export default class MaterialSnackbar extends Vue {

    @Model('modelValue', { type: Boolean, default: false }) readonly value!: boolean;
    @Prop(String) readonly message!: string;

    private ctrl?: MDCSnackbar;

    @Watch('message')
    onMessageChanged(newVal: string, _: string) {
        if (!this.ctrl) return;
        this.ctrl.labelText = newVal;
    }

    @Watch('value')
    onValueChanged(newVal: boolean, _: string) {
        if (!this.ctrl) return;
        if (newVal) this.ctrl.open();
    }

    mounted() {
        this.ctrl = MDCSnackbar.attachTo(this.$el);
        this.ctrl.labelText = this.message;
        this.ctrl.listen('MDCSnackbar:closed', () => {
            this.$emit('update:modelValue', false);
        });
        if (this.value) this.ctrl.open();
    }

    unmounted() {
        if (this.ctrl?.isOpen) this.ctrl?.close();
        this.ctrl?.destroy();
    }
}
</script>

<style lang="scss">
@use "@material/snackbar/mdc-snackbar";
</style>
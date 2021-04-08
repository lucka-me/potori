<template>
<div class="mdc-dialog">
    <div class="mdc-dialog__container">
        <div class="mdc-dialog__surface" role="alertdialog" aria-modal="true">
            <div class="mdc-dialog__content">
                <slot/>
            </div>
            <div class="mdc-dialog__actions">
                <slot name="actions">
                    <material-dialog-action :text="$t('discard')" action="close" as-default/>
                </slot>
            </div>
        </div>
    </div>
    <div class="mdc-dialog__scrim"></div>
</div>
</template>

<script lang="ts">
import { MDCDialog } from '@material/dialog';
import { Vue, Model, Options, Watch } from 'vue-property-decorator';

import MaterialDialogAction from './DialogAction.vue';

import locales from './Dialog.locales.json';

@Options({
    components: {
        MaterialDialogAction
    },
    i18n: {
        messages: locales
    }
})
export default class MaterialDialog extends Vue {

    @Model('modelValue', { type: Boolean, default: false }) readonly value!: boolean;

    private ctrl?: MDCDialog;

    @Watch('value')
    onValueChanged(newVal: boolean, _: string) {
        if (!this.ctrl) return;
        if (newVal) this.ctrl.open();
    }

    mounted() {
        this.ctrl = MDCDialog.attachTo(this.$el);
        this.ctrl.listen('MDCDialog:closed', () => {
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
@use "@material/dialog";

@include dialog.core-styles;
</style>
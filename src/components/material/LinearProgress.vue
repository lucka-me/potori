<template>
<div role="progressbar" class="mdc-linear-progress" aria-valuemin="0" aria-valuemax="1" aria-valuenow="0">
    <div class="mdc-linear-progress__buffer">
        <div class="mdc-linear-progress__buffer-bar"></div>
        <div class="mdc-linear-progress__buffer-dots"></div>
    </div>
    <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
        <span class="mdc-linear-progress__bar-inner"></span>
    </div>
    <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
        <span class="mdc-linear-progress__bar-inner"></span>
    </div>
</div>
</template>

<script lang="ts">
import { MDCLinearProgress } from '@material/linear-progress';
import { Vue, Prop, Watch } from 'vue-property-decorator';

export default class MaterialSwitch extends Vue {

    @Prop(Number) readonly progress!: number;

    private ctrl?: MDCLinearProgress;

    @Watch('progress')
    onProgressChanged(newVal: number, _: number) {
        if (!this.ctrl) return;
        this.ctrl.progress = newVal;
    }

    mounted() {
        this.ctrl = MDCLinearProgress.attachTo(this.$el);
        this.ctrl.progress = this.progress;
    }

    updated() {
        this.ctrl?.destroy();
        this.ctrl = MDCLinearProgress.attachTo(this.$el);
        this.ctrl.open();
        this.ctrl.progress = this.progress;
    }

    unmounted() {
        this.ctrl?.close();
        this.ctrl?.destroy();
    }
}
</script>

<style lang="scss">
@use '~@material/linear-progress';

@include linear-progress.core-styles;
</style>
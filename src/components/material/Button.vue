<template>
<button :class="className">
    <span class="mdc-button__ripple"></span>
    <span class="mdc-button__labbel"><slot/></span>
</button>
</template>

<script lang="ts">
import { MDCRipple } from '@material/ripple';
import { Options, Vue } from 'vue-class-component';

@Options({
    props: {
        outlined: Boolean,
        raised: Boolean
    },
    components: {
        
    },
})
export default class MaterialButton extends Vue {

    private ctrl?: MDCRipple;
    outlined?: boolean;
    raised?: boolean;

    get className(): string {
        let name = 'mdc-button';
        if (this.outlined) {
            name += ' mdc-button--outlined';
        } else if (this.raised) {
            name += ' mdc-button--raised';
        }
        return name;
    }

    mounted() {
        this.ctrl = MDCRipple.attachTo(this.$el);
        this.ctrl.unbounded = true;
    }

    updated() {
        this.ctrl?.destroy();
        this.ctrl = MDCRipple.attachTo(this.$el);
        this.ctrl.unbounded = true;
    }

    unmounted() {
        this.ctrl?.destroy();
    }
}
</script>

<style lang="scss">
@use '~@material/button/styles';

//@include button.core-styles;
</style>
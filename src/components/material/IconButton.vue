<template>
<button class="fa mdc-icon-button">
    <material-icon :icon="icon"/>
</button>
</template>

<script lang="ts">
import { MDCRipple } from '@material/ripple';
import { Options, Vue } from 'vue-class-component';

import MaterialIcon from './Icon.vue';

@Options({
    props: {
        icon: String
    },
    components: {
        MaterialIcon
    },
})
export default class MaterialTopAppBar extends Vue {

    private ctrl?: MDCRipple;

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
@use '~@material/icon-button';

@include icon-button.core-styles;
</style>
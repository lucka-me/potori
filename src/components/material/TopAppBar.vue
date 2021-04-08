<template>
<header class="mdc-top-app-bar mdc-top-app-bar--fixed">
    <div class="mdc-top-app-bar__row">
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
            <material-icon-button v-if="naviBack" class="mdc-top-app-bar__navigation-icon" icon="arrow-left" @click="$router.back()"/>
            <span class="mdc-top-app-bar__title">{{ title }}</span>
        </section>
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
            <slot/>
        </section>
    </div>
</header>
</template>

<script lang="ts">
import { MDCTopAppBar } from '@material/top-app-bar';
import { Vue, Options, Prop } from 'vue-property-decorator';

import MaterialIconButton from './IconButton.vue';

@Options({
    components: {
        MaterialIconButton
    },
})
export default class MaterialTopAppBar extends Vue {

    @Prop(String) readonly title!: string;
    @Prop(Boolean) readonly naviBack?: boolean;

    private ctrl?: MDCTopAppBar;

    mounted() {
        this.ctrl = MDCTopAppBar.attachTo(this.$el);
    }

    updated() {
        this.ctrl?.destroy();
        this.ctrl = MDCTopAppBar.attachTo(this.$el);
    }

    unmounted() {
        this.ctrl?.destroy();
    }
}
</script>

<style lang="scss">
@use '~@material/top-app-bar/mdc-top-app-bar';

.mdc-top-app-bar {
    padding-top: env(safe-area-inset-top);

    > .mdc-top-app-bar__row {
        padding-left: env(safe-area-inset-left);
        padding-right: env(safe-area-inset-right);
    }
}
</style>
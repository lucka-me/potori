<template>
<ul :class="className">
    <slot/>
</ul>
</template>

<script lang="ts">
import { MDCList } from '@material/list';
import { Vue, Prop } from 'vue-property-decorator';

export default class MaterialList extends Vue {

    @Prop(Boolean) readonly twoLine!: boolean;
    @Prop(String) readonly leading?: string;

    private ctrl?: MDCList;

    get className() {
        let name = 'mdc-list';
        // if (this.twoLine) name += ' mdc-list--two-line';
        // if (this.leading) name += ` mdc-list--${this.leading}-list`;
        return name;
    }

    mounted() {
        this.ctrl = MDCList.attachTo(this.$el);
    }

    updated() {
        this.ctrl?.destroy();
        this.ctrl = MDCList.attachTo(this.$el);
    }

    unmounted() {
        this.ctrl?.destroy();
    }
}
</script>

<style lang="scss">
@use "@material/list/evolution-mixins" as list-evolution-mixins;
@include list-evolution-mixins.core-styles();
</style>
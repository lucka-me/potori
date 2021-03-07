<template>
<ul :class="className">
    <slot />
</ul>
</template>

<script lang="ts">
import { MDCList } from '@material/list';
import { Options, Vue } from 'vue-class-component';


@Options({
    props: {
        twoLine: Boolean,
        leading: String
    },
    components: {
        
    },
})
export default class MaterialList extends Vue {

    private ctrl?: MDCList;

    twoLine!: boolean
    leading?: string

    get className() {
        let name = 'mdc-list';
        if (this.twoLine) name += ' mdc-list--two-line';
        if (this.leading) name += ` mdc-list--${this.leading}-list`;
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
@use "@material/list";

@include list.core-styles;
</style>
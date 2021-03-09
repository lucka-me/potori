<template>
<i :class="className"><material-icon-raw :icon="icon"/></i>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import MaterialIconRaw from './IconRaw.vue';

@Options({
    props: {
        icon: String,
        fixedWidth: Boolean
    },
    components: {
        MaterialIconRaw
    }
})
export default class MaterialIcon extends Vue {

    icon!: string;
    fixedWidth?: boolean;

    get className(): string {
        let name = 'fa';
        if (this.fixedWidth) name += ' fa-fw';
        return name;
    }
}
</script>

<style lang="scss">

</style>
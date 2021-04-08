<template>
<i :class="className"><material-icon-raw :icon="icon"/></i>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';

import MaterialIconRaw from './IconRaw.vue';

@Options({
    components: {
        MaterialIconRaw
    },
})
export default class MaterialIcon extends Vue {

    @Prop(String) readonly icon!: string;
    @Prop(Boolean) readonly fixedWidth?: boolean;

    get className(): string {
        let name = 'fa';
        if (this.fixedWidth) name += ' fa-fw';
        return name;
    }
}
</script>

<style lang="scss">

</style>
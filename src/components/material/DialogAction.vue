<template>
<material-button
    type="button" class="mdc-dialog__button"
    :data-mdc-dialog-action="action"
    :data-mdc-dialog-button-default="asDefault">
    {{ text }}
</material-button>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';

import MaterialButton from './Button.vue';

@Options({
    components: {
        MaterialButton
    }
})
export default class MaterialDialogAction extends Vue {
    @Prop(String) readonly action?: string;
    @Prop(Boolean) readonly asDefault?: boolean;
    @Prop(String) readonly text!: string;
}
</script>

<style lang="scss">

</style>
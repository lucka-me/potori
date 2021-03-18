<template>
<div class="status-selector">
    <form-field>
        <material-radio inputId="status-selector-pending" inputName="status-selector" v-model="pending"/>
        <label for="status-selector-pending">Pending</label>
    </form-field>
    <form-field>
        <material-radio inputId="status-selector-accepted" inputName="status-selector" v-model="accepted"/>
        <label for="status-selector-accepted">Accepted</label>
    </form-field>
    <form-field>
        <material-radio inputId="status-selector-rejected" inputName="status-selector" v-model="rejected"/>
        <label for="status-selector-rejected">Rejected</label>
    </form-field>
</div>
</template>

<script lang="ts">
import { Vue, Model, Options } from 'vue-property-decorator';

import { umi } from '@/service/umi';

import MaterialFormField from '@/components/material/FormField.vue';
import MaterialRadio from '@/components/material/Radio.vue';

@Options({
    components: {
        MaterialFormField,
        MaterialRadio
    }
})
export default class StatusSelector extends Vue {

    @Model('modelValue', { type: Number, default: umi.StatusCode.Pending }) readonly value!: umi.StatusCode;

    get pending(): boolean { return this.value === umi.StatusCode.Pending; }
    set pending(value: boolean) { if (value) this.$emit('update:modelValue', umi.StatusCode.Pending); }

    get accepted(): boolean { return this.value === umi.StatusCode.Accepted; }
    set accepted(value: boolean) { if (value) this.$emit('update:modelValue', umi.StatusCode.Accepted); }

    get rejected(): boolean { return this.value === umi.StatusCode.Rejected; }
    set rejected(value: boolean) { if (value) this.$emit('update:modelValue', umi.StatusCode.Rejected); }
}
</script>

<style lang="scss">
.status-selector {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
}
</style>
<template>
<div class="reasons-selector">
    <div v-for="data of reasonData" :key="data.reason.code">
        <material-icon :icon="data.reason.icon" fixed-width/>
        <span>{{ data.reason.title }}</span>
        <div class="spacer"/>
        <material-form-field>
            <material-checkbox :inputId="`reasons-selector-${data.reason.code}`" v-model="data.selected"/>
        </material-form-field>
    </div>
</div>
</template>

<script lang="ts">
import { Vue, Model, Options } from 'vue-property-decorator';

import { umi } from '@/service/umi';

import MaterialCheckbox from "@/components/material/Checkbox.vue";
import MaterialFormField from '@/components/material/FormField.vue';
import MaterialIcon from '@/components/material/Icon.vue';

interface ReasonData {
    reason: umi.Reason;
    selected: boolean;
}

@Options({
    components: {
        MaterialFormField,
        MaterialCheckbox,
        MaterialIcon
    }
})
export default class ReasonsSelector extends Vue {

    @Model('modelValue', { type: Array, default: [] }) readonly value!: Array<umi.ReasonCode>;

    get reasonData(): Array<ReasonData> {
        const reasons: Array<ReasonData> = [];
        for (const [code ,reason] of umi.reason) {
            if (code === umi.Reason.undeclared) continue;
            const getSelected = () => this.value.includes(code);
            const setSelected = (value: boolean) => { this.setSelected(code, value) };
            reasons.push({
                reason: reason,
                get selected(): boolean { return getSelected(); },
                set selected(value : boolean) { setSelected(value); }
            });
        }
        return reasons;
    }

    setSelected(code: umi.ReasonCode, selected: boolean) {
        if (!selected) {
            const index = this.value.indexOf(code);
            if (index > -1) {
                this.value.splice(index, 1);
                this.$emit('update:modelValue', this.value);
            }
        } else if (selected && !this.value.includes(code)) {
            this.value.push(code);
            this.$emit('update:modelValue', this.value);
        }
    }
}
</script>

<style lang="scss">
.reasons-selector {
    > div {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;

        > i {
            margin-inline-end: 0.2em;
        }

        > .spacer {
            flex: 1;
        }
    }
}
</style>
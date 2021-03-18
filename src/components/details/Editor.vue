<template>
<div class="editor">
    <section>
        <h2>Status</h2>
        <status-selector v-model="editData.status"/>
    </section>
    <section v-if="editResultTime">
        <h2>Result Time</h2>
        <material-textfield
            v-model="resultTime"
            label="YYYY-MM-DDTHH:MM"
            type="datetime-local"
            input-id="result-time-editor"
            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
            required
        />
    </section>
    <section v-if="editReasons">
        <h2>Reasons</h2>
    </section>
    <section>
        <h2>Location</h2>
    </section>
</div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';

import Nomination, { LngLat } from '@/service/nomination';
import { umi } from '@/service/umi';

import MaterialTextfield from '@/components/material/Textfield.vue';
import StatusSelector from './editor/StatusSelector.vue';

export class EditData {

    status: umi.StatusCode = umi.StatusCode.Pending;
    resultTime: number = 0;
    reasons: Array<umi.ReasonCode> = [];
    lngLat?: LngLat;

    from(nomination: Nomination) {
        this.status = nomination.status;
        this.resultTime = nomination.resultTime;
        this.reasons = nomination.reasons;
        this.lngLat = nomination.lngLat;
    }
}

@Options({
    components: {
        MaterialTextfield,
        StatusSelector
    }
})
export default class NominationEditor extends Vue {

    @Prop(EditData) readonly editData!: EditData;

    get editResultTime(): boolean {
        return this.editData.status !== umi.StatusCode.Pending;
    }

    get editReasons(): boolean {
        return this.editData.status === umi.StatusCode.Rejected;
    }

    get resultTime(): string {
        const date = new Date();
        date.setTime(this.editData.resultTime - date.getTimezoneOffset() * 60000);
        console.log(`get resultTime ${date.toISOString()}`);
        return date.toISOString().match(/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}/)![0];
    }

    set resultTime(value: string) {
        const time = Date.parse(value);
        if (!time) return;
        this.editData.resultTime = time + (new Date().getTimezoneOffset() * 60000);
    }
}
</script>

<style lang="scss">
@use "~@material/shape";
@use '~@material/theme';
@use '~@material/typography';

.nomination-details {

    > .editor {

        max-width: 50rem;
        margin-left: auto;
        margin-right: auto;

        > section {

            > * {
                width: 100%;
            }

            > h2 {
                @include typography.typography(overline);
            }
        }
    }

}
</style>
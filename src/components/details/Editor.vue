<template>
<div class="editor">
    <section>
        <h2>Status</h2>
        <status-selector v-model="editData.status"/>
    </section>
    <section v-if="editResultTime">
        <h2>Result Time</h2>
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

            > h2 {
                @include typography.typography(overline);
            }
        }
    }

}
</style>
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
        <material-textfield
            v-model="lngLat"
            label="Latitude,Longitude"
            type="text"
            input-id="location-editor"
            pattern="\-?[0-9]{1,2}\.?[0-9]*,\-?[0-9]{1,3}\.?[0-9]*"
        />
        <div class="buttons">
            <material-button @click="pasteIntelURL">Paste Intel Map URL</material-button>
        </div>
    </section>
</div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';

import Nomination, { LngLat } from '@/service/nomination';
import { umi } from '@/service/umi';

import MaterialButton from '@/components/material/Button.vue';
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
        MaterialButton,
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

    get lngLat(): string {
        if (!this.editData.lngLat) return '';
        return `${this.editData.lngLat.lat},${this.editData.lngLat.lng}`;
    }

    set lngLat(value: string) {
        const pair = value.split(',');
        if (pair.length !== 2) return;
        const lat = parseFloat(pair[0]);
        const lng = parseFloat(pair[1]);
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return;
        this.editData.lngLat = { lng, lat };
    }

    pasteIntelURL() {
        const url = window.prompt('Paste Intel Map URL');
        if (!url) return;
        const matched = url.match(/ll\=([\.\d]+),([\.\d]+)/);
        if (!matched || matched.length < 3) return;
        const lat = parseFloat(matched[1]);
        const lng = parseFloat(matched[2]);
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return;
        this.editData.lngLat = { lng, lat };
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

            > .buttons {
                margin-block-start: 0.2em;
            }
        }
    }
}
</style>
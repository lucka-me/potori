<template>
<div class="editor">
    <section>
        <h2>{{ $t('status') }}</h2>
        <status-selector v-model="editData.status"/>
    </section>
    <section v-if="editResultTime">
        <h2>{{ $t('resultTime') }}</h2>
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
        <h2>{{ $t('reasons') }}</h2>
        <reasons-selector v-model="editData.reasons"/>
    </section>
    <section>
        <h2>{{ $t('location') }}</h2>
        <material-textfield
            v-model="lngLat"
            :label="$t('locationLabel')"
            type="text"
            input-id="location-editor"
            pattern="-?[0-9]{1,2}.?[0-9]*,-?[0-9]{1,3}.?[0-9]*"
        />
        <div class="buttons">
            <material-button @click="pasteIntelURL">{{ $t('pasteIntelURL') }}</material-button>
            <material-button @click="queryBrainstorming">{{ $t('queryBrainstorming') }}</material-button>
        </div>
    </section>
    <hr/>
    <div class="actions">
        <material-icon-button icon="trash" :title="$t('delete')" @click="deleteNomination"/>
    </div>
</div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';

import { brainstorming } from '@/service/brainstorming';
import { delibird } from '@/service/delibird';
import { dia } from '@/service/dia';
import { umi } from '@/service/umi';
import Nomination, { LngLat } from '@/service/nomination';

import MaterialButton from '@/components/material/Button.vue';
import MaterialIconButton from '@/components/material/IconButton.vue';
import MaterialTextfield from '@/components/material/Textfield.vue';
import ReasonsSelector from './editor/ReasonsSelector.vue';
import StatusSelector from './editor/StatusSelector.vue';

import locales from './Editor.locales.json';

export class EditData {

    id: string = '';
    status: umi.StatusCode = umi.StatusCode.Pending;
    resultTime: number = 0;
    reasons: Array<umi.ReasonCode> = [];
    lngLat?: LngLat;

    from(nomination: Nomination) {
        this.id = nomination.id;
        this.status = nomination.status;
        this.resultTime = nomination.resultTime;
        this.reasons = nomination.reasons.map((code) => code);
        this.lngLat = nomination.lngLat;
    }

    save(nomination: Nomination) {
        nomination.status = this.status;
        nomination.resultTime = this.resultTime;
        nomination.reasons = this.reasons;
        nomination.lngLat = this.lngLat;
    }

    setLngLat(text: string) {
        const pair = text.split(',');
        if (pair.length !== 2) return;
        const lat = parseFloat(pair[0]);
        const lng = parseFloat(pair[1]);
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return;
        this.lngLat = { lng, lat };
    }
}

@Options({
    components: {
        MaterialButton,
        MaterialIconButton,
        MaterialTextfield,
        StatusSelector,
        ReasonsSelector
    },
    i18n: {
        messages: locales
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
        this.editData.setLngLat(value);
    }

    pasteIntelURL() {
        const url = window.prompt(this.$t('pasteIntelURL'));
        if (!url) return;
        const matched = url.match(/ll\=([\.\d]+,[\.\d]+)/);
        if (!matched || matched.length < 2) return;
        this.lngLat = matched[1];
    }

    async queryBrainstorming() {
        const mockNomination = new Nomination();
        mockNomination.id = this.editData.id;
        mockNomination.status = this.editData.status;
        mockNomination.resultTime = this.editData.resultTime;
        try {
            const record = await brainstorming.query(mockNomination);
            this.editData.lngLat = {
                lng: parseFloat(record.lng),
                lat: parseFloat(record.lat)
            }
        } catch(error) {
            let message = '';
            switch ((error as Error).message) {
                case brainstorming.FailReason.EARLY:
                    message = 'bsEarly';
                    break;
                case brainstorming.FailReason.NOT_EXISTS:
                    message = 'bsNotExists';
                    break;
                case brainstorming.FailReason.INDEXEDDB_ERROR:
                    message = 'bsIndexedDBError';
                    break;
                case brainstorming.FailReason.FIREBASE_ERROR:
                    message = 'bsFirebaseError';
                    break;
                default:
                    break;
            }
            delibird.alert(this.$t(message));
        }
    }

    async deleteNomination() {
        await dia.remove(this.editData.id);
        this.$router.back();
    }
}
</script>

<style lang="scss">
@use "~@material/shape";
@use '~@material/theme';
@use '~@material/typography';

.nomination-details {

    > .editor {
        max-width: 40rem;
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

        > hr {
            border: none;
            height: 1px;
            width: 100%;
            border-top: 1px solid;
            @include theme.property(border-top-color, text-secondary-on-light);
        }

        > .actions {
            display: flex;
            flex-flow: row wrap;
            align-items: center;
            justify-content: space-around;
        }
    }
}
</style>
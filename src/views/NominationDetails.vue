<template>
<material-top-app-bar :title="title" navi-back>
    <material-icon-button v-if="nomination && editing" icon="times" :title="$t('cancel')" @click="cancel"/>
    <material-icon-button v-if="nomination && editing" icon="check" :title="$t('save')" @click="save"/>
    <material-icon-button v-else-if="nomination" icon="pen" :title="$t('edit')" @click="edit"/>
</material-top-app-bar>
<material-top-app-bar-adjust/>
<main v-if="nomination" class="nomination-details">
    <div v-if="!editing" class="details">
        <actions-block :nomination="nomination"/>
        <div class="divider"/>
        <info-block :nomination="nomination"/>
    </div>
    <nomination-editor v-else :edit-data="editData"/>
</main>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import Nomination from '@/service/nomination';
import { service } from '@/service';

import MaterialIconButton from '@/components/material/IconButton.vue';
import MaterialTopAppBar from '@/components/material/TopAppBar.vue';
import MaterialTopAppBarAdjust from '@/components/material/TopAppBarAdjust.vue';
import ActionsBlock from '@/components/details/Actions.vue';
import InfoBlock from '@/components/details/Info.vue';
import NominationEditor, { EditData } from "@/components/details/Editor.vue";

import locales from './NominationDetails.locales.json';

@Options({
    components: {
        MaterialTopAppBar, MaterialTopAppBarAdjust,
        MaterialIconButton,
        ActionsBlock, InfoBlock,
        NominationEditor
    },
    i18n: {
        messages: locales
    }
})
export default class NominationDetails extends Vue {

    nomination?: Nomination;

    editing: boolean = false;
    editData = new EditData();

    get title(): string {
        return this.nomination?.title ?? this.$t('notFound');
    }

    created() {
        const id = this.$route.query.id;
        if (id && typeof(id) === 'string') {
            const nomination = this.$store.state.nominations.find((nomination) => nomination.id === id);
            if (nomination) {
                this.nomination = nomination;
            }
        }
    }

    edit() {
        if (!this.nomination) return;
        this.editData.from(this.nomination);
        this.editing = true;
    }

    cancel() {
        this.editing = false;
    }

    save() {
        if (!this.nomination) return;
        this.editData.save(this.nomination);
        service.update(this.nomination);
        this.editing = false;
    }
}
</script>

<style lang="scss">
@use '~@material/theme';

.nomination-details {
    padding: 1rem;

    > .details {
        display: flex;
        flex-flow: column nowrap;

        > .divider {
            display: none;
        }

        @media screen and (min-width: 600px) {
            flex-flow: row nowrap;

            > .divider {
                display: block;
                border-inline-end: 1px solid;
                @include theme.property(border-inline-end-color, text-secondary-on-light);
                width: 1rem;
                margin-inline-end: 1rem;
            }
        }
    }
}
</style>
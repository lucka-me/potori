<template>
<material-top-app-bar :title="title" navi-back/>
<material-top-app-bar-adjust/>
<main v-if="nomination" class="nomination-details">
    <actions-block :nomination="nomination"/>
    <div class="divider"/>
    <info-block :nomination="nomination"/>
</main>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import Nomination from '@/service/nomination';

import MaterialTopAppBar from '@/components/material/TopAppBar.vue';
import MaterialTopAppBarAdjust from '@/components/material/TopAppBarAdjust.vue';
import ActionsBlock from '@/components/details/Actions.vue';
import InfoBlock from '@/components/details/Info.vue';

@Options({
    components: {
        MaterialTopAppBar, MaterialTopAppBarAdjust,
        ActionsBlock, InfoBlock,
    }
})
export default class NominationDetails extends Vue {

    nomination?: Nomination;

    get title(): string {
        return this.nomination?.title ?? 'Not Found';
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
}
</script>

<style lang="scss">
@use '~@material/theme';

.nomination-details {
    padding: 1rem;

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
</style>
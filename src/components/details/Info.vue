<template>
<div class="info-block">
    <div class="highlights">
        <material-card>
            <div class="contents">
                Comfirmed {{ confirmedTime }}
            </div>
        </material-card>
        <material-card>
            <div class="contents">
                Scanner {{ nomination.scannerData.title }}
            </div>
        </material-card>
    </div>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import Nomination from '@/service/nomination';

import MaterialCard from '@/components/material/Card.vue';

@Options({
    props: {
        nomination: Nomination
    },
    components: {
        MaterialCard,
    }
})
export default class NominationDetails extends Vue {

    nomination!: Nomination;

    get confirmedTime(): string {
        if (!this.nomination) return '';
        return new Date(this.nomination?.confirmedTime).toLocaleDateString();
    }
}
</script>

<style lang="scss">
.info-block {
    flex: 2;
    display: flex;
    flex-flow: column nowrap;
    align-items: stretch;

    > .highlights {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
        gap: 0.6rem;

        .contents {
            margin: 0.4em;
        }
    }
}
</style>
<template>
<div class="title">Last 30 Days</div>
<div class="gallery">
    <material-card
        v-for="nomination of nominations" :key="nomination.id"
        :image="nomination.imageUrl" square-image
        @click="open(nomination.id)"
    >
        <div class="caption">
            <material-icon :icon="nomination.statusData.icon" fixed-width/>
            <span>{{ nomination.title }}</span>
        </div>
    </material-card>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import Nomination, { Predicator } from '@/service/nomination';

import MaterialCard from '@/components/material/Card.vue';
import MaterialIcon from '@/components/material/Icon.vue';

@Options({
    components: {
        MaterialCard, MaterialIcon
    },
})
export default class Gallery extends Vue {

    private static readonly datePast30Days = Date.now() - (30 * 24 * 3600 * 1000);
    private static readonly predicator: Predicator = (nomination) => {
        return nomination.confirmedTime > Gallery.datePast30Days || nomination.resultTime > Gallery.datePast30Days;
    } 

    get nominations(): Array<Nomination> {
        return this.$store.state.nominations.filter(Gallery.predicator).sort(Nomination.comparatorByTime);
    }

    open(id: string) {
        this.$router.push({
            path: '/details',
            query: { id: id }
        });
    }
}
</script>

<style lang="scss">
@use "~@material/shape";
@use '~@material/typography';

.gallery {
    display: flex;
    flex-flow: row nowrap;
    margin-left: -1rem;
    margin-right: -1rem;
    overflow: auto;

    > .mdc-card {
        margin-inline-start: 0.6rem;
        min-width: 6rem;
        width: 6rem;

        &:first-child {
            margin-inline-start: 1rem;
        }

        &:last-child {
            margin-inline-end: 1rem;
        }

        .caption {
            @include typography.typography(caption);
            @include typography.overflow-ellipsis;

            margin: 0.4em;

            > i {
                margin-inline-end: 0.2em;
            }
        }
    }
}
</style>
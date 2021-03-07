<template>
<div class="title">Last 30 Days</div>
<div class="gallery">
    <div v-for="nomination of nominations" :key="nomination.id">
        <img :src="nomination.imageUrl" @click="open(nomination.id)" />
        <div class="caption">{{ nomination.title }}</div>
    </div>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import Nomination, { Predicator } from '@/service/nomination';

@Options({
    components: {

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
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
    gap: 0.6rem;

    > div {
        
        > img {
            @include shape.radius(medium);

            width: 6rem;
            height: 6rem;
            object-fit: cover;
            object-position: center;
            cursor: pointer;
        }

        > .caption {
            @include typography.typography(caption);
            @include typography.overflow-ellipsis;

            margin-left: 0.4em;
            margin-right: 0.4em;
        }
    }
}
</style>
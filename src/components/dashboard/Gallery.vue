<template>
<div class="title">Last 30 Days</div>
<div class="gallery">
    <div v-for="nomination of nominations" :key="nomination.id" @click="open(nomination.id)">
        {{ nomination.title }}
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
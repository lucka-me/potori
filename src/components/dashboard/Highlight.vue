<template>
<h2>Hightlight</h2>
<div class="card-grid">
    <dashboard-card title="All" icon="arrow-up" :count="$store.state.nominations.length" @click="open" />
    <dashboard-card
        v-for="status of statuses" :key="status.code"
        :title="status.title" :icon="status.icon" :count="$store.getters.count(status.predicator)"
        @click="open(status)"
    />
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { RouteLocationRaw } from 'vue-router';

import { umi } from '@/service/umi';

import DashboardCard from './Card.vue';

@Options({
    components: {
        DashboardCard
    },
})
export default class Highlight extends Vue {
    get statuses(): Array<umi.Status> {
        const list: Array<umi.Status> = [];
        for (const status of umi.status.values()) {
            list.push(status);
        }
        return list;
    }

    open(status?: umi.Status) {
        const location: RouteLocationRaw = { path: '/list' };
        if (status) location.query = { status: status.code };
        this.$router.push(location);
    }
}
</script>

<style lang="scss">

</style>
<template>
<div class="title">Reasons</div>
<div class="card-grid">
    <dashboard-card
        v-for="data of reasons" :key="data.reason.code"
        :title="data.reason.title" :icon="data.reason.icon" :count="data.count"
        @click="open(reason)"
    />
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { umi } from '@/service/umi';

import DashboardCard from './Card.vue';

interface ReasonData {
    reason: umi.Reason;
    count: number;
}

@Options({
    components: {
        DashboardCard
    },
})
export default class Reasons extends Vue {

    get reasons(): Array<ReasonData> {
        const list: Array<ReasonData> = [];
        for (const reason of umi.reason.values()) {
            const count = this.$store.getters.count(reason.predicator);
            if (count < 1) continue;
            list.push({ reason: reason, count: count });
        }
        return list;
    }

    open(reason: umi.Scanner) {
        this.$router.push({
            path: '/list',
            query: { reason: reason.code }
        });
    }
}
</script>

<style lang="scss">

</style>
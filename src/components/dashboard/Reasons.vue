<template>
<div class="title">Reasons</div>
<div class="card-grid">
    <dashboard-card
        v-for="reason of reasons" :key="reason.code"
        :title="reason.title" :icon="reason.icon" :text="$store.getters.count(reason.predicator)"
        @click="open(reason)"
    />
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { umi } from '@/service/umi';

import DashboardCard from './Card.vue';

@Options({
    components: {
        DashboardCard
    },
})
export default class Reasons extends Vue {

    get reasons(): Array<umi.Reason> {
        const list: Array<umi.Reason> = [];
        for (const reason of umi.reason.values()) {
            list.push(reason);
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
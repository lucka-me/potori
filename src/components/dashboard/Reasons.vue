<template>
<div class="title title-with-action">
    <span>Reasons</span>
    <div class="spacer"/>
    <material-button @click="toggleMore">{{ more ? 'Less' : 'More' }}</material-button>
</div>
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

import MaterialButton from '@/components/material/Button.vue';
import DashboardCard from './Card.vue';

interface ReasonData {
    reason: umi.Reason;
    count: number;
}

@Options({
    components: {
        MaterialButton,
        DashboardCard
    },
})
export default class Reasons extends Vue {

    more: boolean = false;

    get reasons(): Array<ReasonData> {
        const list: Array<ReasonData> = [];
        for (const reason of umi.reason.values()) {
            const count = this.$store.getters.count(reason.predicator);
            if (count < 1) continue;
            list.push({ reason: reason, count: count });
            if (!this.more && list.length > 3) break;
        }
        return list;
    }

    toggleMore() {
        this.more = !this.more;
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
.dashboard {
    > .title-with-action {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;

        > .spacer {
            flex: 1;
        }
    }
}
</style>
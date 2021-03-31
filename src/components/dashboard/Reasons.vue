<template>
<h2 class="title-with-action">
    <span>{{ $t('header') }}</span>
    <div class="spacer"/>
    <material-button @click="toggleMore">{{ $t(more ? 'less' : 'more') }}</material-button>
</h2>
<div class="card-grid">
    <dashboard-card
        v-for="data of dataset" :key="data.reason.code"
        :title="data.reason.title" :icon="data.reason.icon" :count="data.count"
        @click="open(data.reason)"
    />
</div>
</template>

<script lang="ts">
import { Vue, Options, Watch } from 'vue-property-decorator';

import { dia } from '@/service/dia';
import { umi } from '@/service/umi';

import MaterialButton from '@/components/material/Button.vue';
import DashboardCard from './Card.vue';

import locales from './Reasons.locales.json';

interface ReasonData {
    reason: umi.Reason;
    count: number;
}

@Options({
    components: {
        MaterialButton,
        DashboardCard
    },
    i18n: {
        messages: locales
    }
})
export default class Reasons extends Vue {

    more: boolean = false;
    private datasetAll: Array<ReasonData> = [];

    get saveID(): number {
        return this.$store.state.dia.saveID;
    }

    get dataset(): Array<ReasonData> {
        return this.more ? this.datasetAll : this.datasetAll.slice(0, 4);
    }

    created() {
        this.updateData();
    }

    @Watch('saveID')
    onSaved() {
        this.updateData();
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

    private async updateData() {
        const stats = new Map<umi.ScannerCode, ReasonData>();
        const nominations = await dia.getAll(umi.status.get(umi.StatusCode.Rejected)!.predicator);
        for (const reason of umi.reason.values()) {
            const count = nominations.filter(reason.predicator).length;
            if (count < 1) continue;
            stats.set(reason.code, { reason: reason, count: count });
        }
        this.datasetAll = Array.from(stats.values());
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
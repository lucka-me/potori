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
        const list: Array<ReasonData> = [];
        const queries: Array<Promise<void>> = [];
        for (const reason of umi.reason.values()) {
            const query = dia.count(reason.predicator).then(count => {
                if (count < 1) return;
                list.push({ reason: reason, count: count });
            });
            queries.push(query);
        }
        await Promise.allSettled(queries);
        this.datasetAll = list.sort((a, b) => a.reason.code > b.reason.code ? 1 : -1);
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
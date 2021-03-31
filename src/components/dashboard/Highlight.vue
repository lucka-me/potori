<template>
<h2>{{ $t('header') }}</h2>
<div class="card-grid">
    <dashboard-card :title="$t('all')" icon="arrow-up" :count="countAll" @click="open"/>
    <dashboard-card
        v-for="data of dataset" :key="data.status.code"
        :title="data.status.title" :icon="data.status.icon" :count="data.count"
        @click="open(data.status)"
    />
</div>
</template>

<script lang="ts">
import { Vue, Options, Watch } from 'vue-property-decorator';
import { RouteLocationRaw } from 'vue-router';

import { dia } from '@/service/dia';
import { umi } from '@/service/umi';

import DashboardCard from './Card.vue';

import locales from './Highlight.locales.json';

interface StatusData {
    status: umi.Status;
    count: number;
}

@Options({
    components: {
        DashboardCard
    },
    i18n: {
        messages: locales
    }
})
export default class Highlight extends Vue {

    countAll: number = 0;
    dataset: Array<StatusData> = [];

    get saveID(): number {
        return this.$store.state.dia.saveID;
    }

    created() {
        this.updateData();
    }

    @Watch('saveID')
    onSaved() {
        this.updateData();
    }

    open(status?: umi.Status) {
        const location: RouteLocationRaw = { path: '/list' };
        if (status) location.query = { status: status.code };
        this.$router.push(location);
    }

    private async updateData() {
        dia.count().then(count => this.countAll = count);
        const list: Array<StatusData> = [];
        const queries: Array<Promise<void>> = [];
        for (const status of umi.status.values()) {
            const data: StatusData = { status: status, count: 0 };
            list.push(data);
            const query = dia.count(status.predicator).then(count => { data.count = count; });
            queries.push(query);
        }
        await Promise.allSettled(queries);
        this.dataset = list;
    }
}
</script>

<style lang="scss">

</style>
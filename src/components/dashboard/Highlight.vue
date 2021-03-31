<template>
<h2>{{ $t('header') }}</h2>
<div class="card-grid">
    <dashboard-card :title="$t('all')" icon="arrow-up" :count="countAll" @click="open"/>
    <dashboard-card
        v-for="status of statuses" :key="status.status.code"
        :title="status.status.title" :icon="status.status.icon" :count="status.count"
        @click="open(status.status)"
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
    statuses: Array<StatusData> = [];

    get saveID(): number {
        return this.$store.state.dia.saveID;
    }

    mounted() {
        this.update();
    }

    @Watch('saveID')
    onSaved() {
        this.update();
    }

    open(status?: umi.Status) {
        const location: RouteLocationRaw = { path: '/list' };
        if (status) location.query = { status: status.code };
        this.$router.push(location);
    }

    private async update() {
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
        this.statuses = list;
    }
}
</script>

<style lang="scss">

</style>
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
        const stats = new Map<umi.StatusCode, StatusData>();
        for (const status of umi.status.values()) {
            stats.set(status.code, { status: status, count: 0 });
        }
        const nominations = await dia.getAll();
        for (const nomination of nominations) {
            const data = stats.get(nomination.status)!;
            data.count++;
        }
        this.countAll = nominations.length;
        this.dataset = Array.from(stats.values());
    }
}
</script>

<style lang="scss">

</style>
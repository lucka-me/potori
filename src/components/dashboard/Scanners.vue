<template>
<h2>{{ $t('header') }}</h2>
<div class="card-grid">
    <dashboard-card
        v-for="data of dataset" :key="data.scanner.code"
        :title="data.scanner.title" icon="mobile-alt" :count="data.count"
        @click="open(data.scanner)"
    />
</div>
</template>

<script lang="ts">
import { Vue, Options, Watch } from 'vue-property-decorator';

import { dia } from '@/service/dia';
import { umi } from '@/service/umi';

import DashboardCard from './Card.vue';

import locales from './Scanners.locales.json';

interface ScannerData {
    scanner: umi.Scanner;
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
export default class Scanners extends Vue {

    dataset: Array<ScannerData> = [];

    created() {
        this.updateData();
    }

    @Watch('saveID')
    onSaved() {
        this.updateData();
    }

    open(scanner: umi.Scanner) {
        this.$router.push({
            path: '/list',
            query: { scanner: scanner.code }
        });
    }

    private async updateData() {
        const stats = new Map<umi.ScannerCode, ScannerData>();
        for (const scanner of umi.scanner.values()) {
            if (scanner.code === umi.ScannerCode.Unknown) continue;
            stats.set(scanner.code, { scanner: scanner, count: 0 });
        }
        const nominations = await dia.getAll();
        for (const nomination of nominations) {
            if (nomination.scanner === umi.ScannerCode.Unknown) continue;
            const data = stats.get(nomination.scanner)!;
            data.count++;
        }
        this.dataset = Array.from(stats.values())
            .filter(data => data.count > 0)
            .sort((a, b) => a.scanner.code > b.scanner.code ? 1 : -1);
    }
}
</script>

<style lang="scss">

</style>
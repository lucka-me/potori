<template>
<h2>{{ $t('header') }}</h2>
<div class="card-grid">
    <dashboard-card
        v-for="data of scanners" :key="data.scanner.code"
        :title="data.scanner.title" icon="mobile-alt" :count="data.count"
        @click="open(data.scanner)"
    />
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

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

    get scanners(): Array<ScannerData> {
        const list: Array<ScannerData> = [];
        for (const scanner of umi.scanner.values()) {
            if (scanner.code === umi.ScannerCode.Unknown) continue;
            const count = this.$store.getters['data/count'](scanner.predicator);
            if (count < 1) continue;
            list.push({
                scanner: scanner,
                count: count
            });
        }
        return list;
    }

    open(scanner: umi.Scanner) {
        this.$router.push({
            path: '/list',
            query: { scanner: scanner.code }
        });
    }
}
</script>

<style lang="scss">

</style>
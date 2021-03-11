<template>
<div class="title">Scanners</div>
<div class="card-grid">
    <dashboard-card
        v-for="scanner of scanners" :key="scanner.code"
        :title="scanner.title" icon="mobile-alt" :count="$store.getters.count(scanner.predicator)"
        @click="open(scanner)"
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
export default class Scanners extends Vue {

    get scanners(): Array<umi.Scanner> {
        const list: Array<umi.Scanner> = [];
        for (const scanner of umi.scanner.values()) {
            if (scanner.code === umi.ScannerCode.Unknown) continue;
            list.push(scanner);
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
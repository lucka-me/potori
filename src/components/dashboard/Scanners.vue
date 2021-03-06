<template>
<div class="scanners">
    <div v-for="scanner of scanners" :key="scanner.code" @click="open(scanner)">
        {{ scanner.title }}: {{ $store.getters.count(scanner.predicator) }}
    </div>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { umi } from '@/service/umi';

@Options({
    components: {

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
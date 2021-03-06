<template>
<div class="reasons">
    <div v-for="reason of reasons" :key="reason.code" @click="open(reason)">
        {{ reason.title }}: {{ $store.getters.count(reason.predicator) }}
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
export default class Reasons extends Vue {

    get reasons(): Array<umi.Reason> {
        const list: Array<umi.Reason> = [];
        for (const reason of umi.reason.values()) {
            list.push(reason);
        }
        return list;
    }

    open(reason: umi.Scanner) {
        this.$router.push({
            path: '/list',
            query: { reason: reason.code }
        });
    }
}
</script>
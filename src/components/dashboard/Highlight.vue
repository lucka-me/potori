<template>
<div class="highlight">
    <div @click="open()">All: {{ $store.state.nominations.length }}</div>
    <div v-for="status of statuses" :key="status.code" @click="open(status)">
        {{ status.title }}: {{ $store.getters.count(status.predicator) }}
    </div>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { RouteLocationRaw } from 'vue-router';

import { umi } from '@/service/umi';

@Options({
    components: {

    },
})
export default class Highlight extends Vue {
    get statuses(): Array<umi.Status> {
        const list: Array<umi.Status> = [];
        for (const status of umi.status.values()) {
            list.push(status);
        }
        return list;
    }

    open(status?: umi.Status) {
        const location: RouteLocationRaw = { path: '/list' };
        if (status) location.query = { status: status.code };
        this.$router.push(location);
    }
}
</script>
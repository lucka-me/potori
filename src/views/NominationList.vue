<template>
<material-top-app-bar :title="title"/>
<material-top-app-bar-adjust/>
<div class="nomination-list">
    {{ title }}
    |
    <router-link to="../">Back</router-link>
    <hr>
    <div v-for="nomination in nominations" :key="nomination.id" @click="open(nomination.id)">
        {{ nomination.title }}
    </div>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import Nomination from '@/service/nomination';
import { umi } from '@/service/umi';

import MaterialTopAppBar from '@/components/material/TopAppBar.vue';
import MaterialTopAppBarAdjust from '@/components/material/TopAppBarAdjust.vue';

@Options({
    components: {
        MaterialTopAppBar, MaterialTopAppBarAdjust,
    },
})
export default class NominationList extends Vue {
    get title(): string {
        return this.commonSense?.title || 'All';
    }

    get nominations(): Array<Nomination> {
        let list = this.$store.state.nominations;
        const commonSense = this.commonSense;
        if (commonSense) list = list.filter(commonSense.predicator);
        list = list.sort(Nomination.comparatorByTime);
        return list;
    }

    private get commonSense(): umi.CommonSense | null {
        if (this.$route.query.status && typeof(this.$route.query.status) === 'string') {
            const code = parseInt(this.$route.query.status);
            return umi.status.get(code) || null;
        }
        if (this.$route.query.reason && typeof(this.$route.query.reason) === 'string') {
            const code = parseInt(this.$route.query.reason);
            console.log(code);
            return umi.reason.get(code) || null;
        }
        if (this.$route.query.scanner && typeof(this.$route.query.scanner) === 'string') {
            const code = parseInt(this.$route.query.scanner);
            return umi.scanner.get(code) || null;
        }
        return null;
    }

    open(id: string) {
        this.$router.push({
            path: '/details',
            query: { id: id }
        });
    }
}
</script>

<style lang="scss">

</style>
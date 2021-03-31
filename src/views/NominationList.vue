<template>
<material-top-app-bar :title="title" navi-back>
    <material-icon-button icon="map" :title="$t('map')" @click="openMap"/>
</material-top-app-bar>
<material-top-app-bar-adjust/>
<main>
    <material-list class="nomination-list" leading="image" two-line>
        <nomination-list-row
            v-for="nomination in nominations" :key="nomination.id"
            :nomination="nomination"
            @click="open(nomination.id)"
        />
    </material-list>
</main>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import Nomination from '@/service/nomination';
import { umi } from '@/service/umi';

import MaterialIconButton from '@/components/material/IconButton.vue';
import MaterialList from '@/components/material/List.vue';
import MaterialTopAppBar from '@/components/material/TopAppBar.vue';
import MaterialTopAppBarAdjust from '@/components/material/TopAppBarAdjust.vue';
import NominationListRow from '@/components/list/Row.vue';

import locales from './NominationList.locales.json';

@Options({
    components: {
        MaterialTopAppBar, MaterialTopAppBarAdjust,
        MaterialIconButton,
        MaterialList,
        NominationListRow
    },
    i18n: {
        messages: locales
    }
})
export default class NominationList extends Vue {
    get title(): string {
        return this.commonSense?.title ?? this.$t('all');
    }

    get nominations(): Array<Nomination> {
        let list = this.$store.state.data.nominations;
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
            return umi.reason.get(code) || null;
        }
        if (this.$route.query.scanner && typeof(this.$route.query.scanner) === 'string') {
            const code = parseInt(this.$route.query.scanner);
            return umi.scanner.get(code) || null;
        }
        return null;
    }

    openMap() {
        this.$router.push({
            path: '/map',
            query: this.$route.query
        });
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
.nomination-list {
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }
}
</style>
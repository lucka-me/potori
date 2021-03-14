<template>
<material-top-app-bar :title="title" navi-back/>
<material-top-app-bar-adjust/>
<main class="nomination-map">
    <div id="map-container"/>
</main>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import 'mapbox-gl/dist/mapbox-gl.css';

import Nomination from '@/service/nomination';
import { umi } from '@/service/umi';

import MaterialTopAppBar from '@/components/material/TopAppBar.vue';
import MaterialTopAppBarAdjust from '@/components/material/TopAppBarAdjust.vue';

@Options({
    components: {
        MaterialTopAppBar, MaterialTopAppBarAdjust,
    },
})
export default class NominationMap extends Vue {

    private ctrl?: mapboxgl.Map;

    get title(): string {
        return this.commonSense?.title ?? 'All';
    }

    get nominations(): Array<Nomination> {
        let list = this.$store.state.nominations.filter((nomination) => nomination.lngLat);
        const commonSense = this.commonSense;
        if (commonSense) list = list.filter(commonSense.predicator);
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

    mounted() {
        import(
            /* webpackChunkName: 'mapbox' */
            'mapbox-gl'
        ).then((mapboxgl) => {
            this.ctrl = new mapboxgl.Map({
                container: 'map-container',
                accessToken: 'pk.eyJ1IjoibHVja2EtbWUiLCJhIjoiY2p2NDk5NmRvMHFreTQzbzduemM1MHV4cCJ9.7XGmxnEJRoCDr-i5BBmBfw',
                style: 'mapbox://styles/mapbox/outdoors-v11',
            });
            this.ctrl.resize();
        });
    }
}
</script>

<style lang="scss">
body {
    margin: 0;
}

.nomination-map {
    margin: 0;
    display: flex;
    flex-flow: column nowrap;

    > #map-container {
        width: 100%;
        height: 30rem;
    }
}
</style>
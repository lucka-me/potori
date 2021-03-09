<template>
<div class="map"/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import type mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { LngLat } from '@/service/nomination';

@Options({
    props: {
        lngLat: Object
    },
    components: {
        
    }
})
export default class DetailsMap extends Vue {

    private ctrl?: mapboxgl.Map;
    lngLat!: LngLat;

    mounted() {
        import(
            /* webpackChunkName: 'mapbox' */
            'mapbox-gl'
        ).then((mapboxgl) => {
            mapboxgl.accessToken = 'pk.eyJ1IjoibHVja2EtbWUiLCJhIjoiY2p2NDk5NmRvMHFreTQzbzduemM1MHV4cCJ9.7XGmxnEJRoCDr-i5BBmBfw';
            this.ctrl = new mapboxgl.Map({
                container: this.$el,
                style: 'mapbox://styles/mapbox/outdoors-v11',
                center: this.lngLat,
                zoom: 16
            });
            new mapboxgl.Marker().setLngLat(this.lngLat).addTo(this.ctrl);
        });
    }
}
</script>

<style lang="scss">

</style>
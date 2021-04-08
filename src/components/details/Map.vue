<template>
<div class="map"/>
</template>

<script lang="ts">
import { Vue, Prop } from 'vue-property-decorator';

import 'mapbox-gl/dist/mapbox-gl.css';

import { LngLat } from '@/service/nomination';

export default class DetailsMap extends Vue {

    @Prop(Object) readonly lngLat!: LngLat;

    private ctrl?: mapboxgl.Map;

    mounted() {
        import(
            /* webpackChunkName: 'mapbox' */
            'mapbox-gl'
        ).then((mapboxgl) => {
            this.ctrl = new mapboxgl.Map({
                container: this.$el,
                accessToken: 'pk.eyJ1IjoibHVja2EtbWUiLCJhIjoiY2p2NDk5NmRvMHFreTQzbzduemM1MHV4cCJ9.7XGmxnEJRoCDr-i5BBmBfw',
                style: 'mapbox://styles/mapbox/outdoors-v11',
                center: this.lngLat,
                zoom: 16
            });
            new mapboxgl.Marker().setLngLat(this.lngLat).addTo(this.ctrl);
            this.ctrl.resize();
        });
    }
}
</script>

<style lang="scss">

</style>
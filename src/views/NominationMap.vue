<template>
<material-top-app-bar :title="title" navi-back/>
<material-top-app-bar-adjust/>
<main class="ignore-safe-area" id="nomination-map">
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
                container: 'nomination-map',
                accessToken: 'pk.eyJ1IjoibHVja2EtbWUiLCJhIjoiY2p2NDk5NmRvMHFreTQzbzduemM1MHV4cCJ9.7XGmxnEJRoCDr-i5BBmBfw',
                style: 'mapbox://styles/mapbox/outdoors-v11',
            });
            this.ctrl.addControl(new mapboxgl.NavigationControl());
            this.ctrl.addControl(new mapboxgl.FullscreenControl());
            this.ctrl.once('idle', () => {
                if (!this.ctrl) return;
                this.ctrl.resize();
                this.pourData();
            });
        });
    }

    private pourData() {
        if (!this.ctrl) return;
        const nominations = this.nominations;
        // Generate GeoJSON and get bounds
        const boundsNE = { lng: -181.0, lat: -91.0 };
        const boundsSW = { lng:  181.0, lat:  91.0 };
        const geoJSON: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
            type: 'FeatureCollection',
            features: nominations.map((nomination) => {
                const lngLat = nomination.lngLat!;
                if (lngLat.lng > boundsNE.lng) boundsNE.lng = lngLat.lng;
                if (lngLat.lng < boundsSW.lng) boundsSW.lng = lngLat.lng;
                if (lngLat.lat > boundsNE.lat) boundsNE.lat = lngLat.lat;
                if (lngLat.lat < boundsSW.lat) boundsSW.lat = lngLat.lat;
                return {
                    type: 'Feature',
                    properties: { title: nomination.title },
                    geometry: {
                        type: 'Point',
                        coordinates: [lngLat.lng, lngLat.lat],
                    }
                }
            }),
        };
        const id = 'nominations';
        const color = '#2578B5';
        const colorDark = '#004D85';

        // Add source and layers
        this.ctrl.addSource(id, {
            type: 'geojson',
            data: geoJSON,
            cluster: true,
        });
        this.ctrl.addLayer({
            id: `${id}-cluster`,
            type: 'circle',
            source: id,
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': color,
                'circle-opacity': 0.6,
                'circle-stroke-width': 4,
                'circle-stroke-color': colorDark,
                'circle-radius': [
                    'step', ['get', 'point_count'],
                    20, 50,
                    30, 100,
                    40
                ]
            }
        });
        this.ctrl.addLayer({
            id: `${id}-count`,
            type: 'symbol',
            source: id,
            filter: ['has', 'point_count'],
            layout: {
                'text-field': '{point_count_abbreviated}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12,
            },
            paint: {
                'text-color': '#000',
            }
        });
        this.ctrl.addLayer({
            id: `${id}-unclustered`,
            type: 'circle',
            source: id,
            filter: ['!', ['has', 'point_count']],
            paint: {
                'circle-color': color,
                'circle-radius': 5,
                'circle-stroke-width': 2,
                'circle-stroke-color': colorDark
            }
        });

        // Set listener
        this.ctrl.on('click', `${id}-cluster`, event => {
            if (!this.ctrl || !event.features) return;
            const feature = event.features[0];
            const clusterId = feature.properties!.cluster_id;
            (this.ctrl.getSource(id) as mapboxgl.GeoJSONSource).getClusterExpansionZoom(
                clusterId,
                (err, zoom) => {
                    if (!this.ctrl || err) return;
                    this.ctrl.easeTo({
                        center: (feature.geometry as GeoJSON.Point).coordinates as [number, number],
                        zoom: zoom
                    });
                }
            );
        });

        this.ctrl.on('click', `${id}-unclustered`, event => {
            if (!this.ctrl || !event.features) return;
            const feature = event.features[0];
            const coordinates = (feature.geometry as GeoJSON.Point).coordinates as [number, number];
            while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            import(
                /* webpackChunkName: 'mapbox' */
                'mapbox-gl'
            ).then((mapboxgl) => {
                if (!this.ctrl) return;
                new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setText(feature.properties!.title)
                    .addTo(this.ctrl);
            });
        });

        // Fit the bounds
        if (boundsSW.lng > -181) {
            this.ctrl.fitBounds([boundsSW, boundsNE], { linear: true, padding: 16 });
        }
    }
}
</script>

<style lang="scss">
main#nomination-map {
    margin: 0;
    flex: 1;
}
</style>
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { DashboardPrototype, Eli } from './prototypes';
import FilterCard from './FilterCard';
import Nomination, { LngLat } from '../../service/nomination';
import statusKit from '../../service/status';

interface MapCardEvents {
    focus: (id: string) => void,
    styleLoaded: () => Array<Nomination>,
}

class MapCard extends DashboardPrototype {

    ctrl: mapboxgl.Map = null;
    events: MapCardEvents = {
        focus: () => { },
        styleLoaded: () => [],
    }
    private tasks: Array<() => void> = [];

    render() {
        const elementMap = Eli.build('div', {
            cssText: [
                'width: 100%',
                'height: 100%',
                'clip-path: inset(100% round 4px)',
                '-webkit-clip-path: inset(0 round 4px)',
            ].join(';'),
        });
        this.root = Eli.build('div', {
            className: 'mdc-card mdc-card--outlined flex--3 flex-shrink--1',
            cssText: 'min-width: 300px;',
        }, [ elementMap ]);
        this.parent.append(this.root);

        mapboxgl.accessToken = 'pk.eyJ1IjoibHVja2EtbWUiLCJhIjoiY2p2NDk5NmRvMHFreTQzbzduemM1MHV4cCJ9.7XGmxnEJRoCDr-i5BBmBfw';
        this.ctrl = new mapboxgl.Map({
            container: elementMap,
            style: `mapbox:${getComputedStyle(document.documentElement).getPropertyValue('--map-style').trim()}?optimize=true`
        });
        this.ctrl.on('idle', () => this.executeTasks());
        this.ctrl.addControl(new mapboxgl.NavigationControl());
        this.ctrl.addControl(new mapboxgl.FullscreenControl());
        this.resize();
    }

    get loaded() {
        return this.ctrl && this.ctrl.isStyleLoaded();
    }

    update(nominations: Array<Nomination>) {
        if (!this.loaded) {
            this.tasks.push(() => this.update(nominations));
            return;
        }
        this.updateRejected(nominations);
        this.updateSource(
            'accepted',
            MapCard.generateGeoJSON(nominations, [ statusKit.types.get('accepted').code ])
        );
        this.updateSource(
            'pending',
            MapCard.generateGeoJSON(nominations, [ statusKit.types.get('pending').code ])
        );
    }

    updateStyle() {
        if (!this.loaded) {
            this.tasks.push(() => this.updateStyle());
            return;
        }
        this.ctrl.setStyle(`mapbox:${getComputedStyle(document.documentElement).getPropertyValue('--map-style').trim()}?optimize=true`);
        this.update(this.events.styleLoaded());
    }

    setTypeVisible(type: string, visible: boolean) {
        if (!this.loaded) {
            this.tasks.push(() => this.setTypeVisible(type, visible));
            return;
        }
        const visibility = visible ? 'visible' : 'none';
        this.ctrl.setLayoutProperty(`potori-${type}-cluster`    , 'visibility', visibility);
        this.ctrl.setLayoutProperty(`potori-${type}-count`      , 'visibility', visibility);
        this.ctrl.setLayoutProperty(`potori-${type}-unclustered`, 'visibility', visibility);
    }

    easeTo(center: LngLat) {
        if (!this.loaded) {
            this.tasks.push(() => this.easeTo(center));
            return;
        }
        const zoom = this.ctrl.getZoom();
        this.ctrl.easeTo({
            center: center,
            zoom: zoom < 15 ? 15 : zoom,
        });
    }

    resize() {
        if (!this.loaded) {
            this.tasks.push(() => this.resize());
            return;
        }
        this.ctrl.resize();
    }

    fit(nominations: Array<Nomination>) {
        if (!this.loaded) {
            this.tasks.push(() => this.fit(nominations));
            return;
        }
        const boundsNE = { lng: -181.0, lat: -91.0 };
        const boundsSW = { lng:  181.0, lat:  91.0 };
        for (const nomination of nominations) {
            if (!nomination.lngLat) continue;
            if (nomination.lngLat.lng > boundsNE.lng) boundsNE.lng = nomination.lngLat.lng;
            if (nomination.lngLat.lng < boundsSW.lng) boundsSW.lng = nomination.lngLat.lng;
            if (nomination.lngLat.lat > boundsNE.lat) boundsNE.lat = nomination.lngLat.lat;
            if (nomination.lngLat.lat < boundsSW.lat) boundsSW.lat = nomination.lngLat.lat;
        }
        if (boundsSW.lng > -181) {
            this.ctrl.fitBounds([boundsSW, boundsNE], { linear: true });
        }
    }

    updateRejected(nominations: Array<Nomination>) {
        if (!this.loaded) {
            this.tasks.push(() => this.updateRejected(nominations));
            return;
        }
        const codes: Array<number> = [];
        for (const [key, value] of FilterCard.reasons.entries()) {
            if (!value.checked) continue;
            codes.push(key.code);
        }
        this.updateSource('rejected', MapCard.generateGeoJSON(nominations, codes));
    }

    private executeTasks() {
        const count = this.tasks.length;
        for (let i = 0; i < count; i++) {
            this.tasks.shift()();
        }
    }

    private updateSource(type: string, data: GeoJSON.FeatureCollection<GeoJSON.Geometry>) {
        const id = `potori-${type}`;
        const source = this.ctrl.getSource(id) as mapboxgl.GeoJSONSource;
        if (source) {
            source.setData(data);
            return;
        }
        this.ctrl.addSource(id, {
            type: 'geojson',
            data: data,
            cluster: true,
        });
        const style = getComputedStyle(document.documentElement);
        const color = style.getPropertyValue(`--color-${type}`);
        const colorDark = style.getPropertyValue(`--color-${type}--dark`);
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
                'text-color': getComputedStyle(document.documentElement).getPropertyValue('--mdc-theme-on-surface'),
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

        this.ctrl.on('click', `${id}-cluster`, event => {
            const features = this.ctrl.queryRenderedFeatures(
                event.point, { layers: [`${id}-cluster`] }
            );
            const clusterId = features[0].properties.cluster_id;
            (this.ctrl.getSource(id) as mapboxgl.GeoJSONSource).getClusterExpansionZoom(
                clusterId,
                (err, zoom) => {
                    if (err) return;
                    this.ctrl.easeTo({
                        center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number],
                        zoom: zoom
                    });
                }
            );
        });

        this.ctrl.on('click', `${id}-unclustered`, event => {
            (event.features[0].geometry as GeoJSON.Point).coordinates as [number, number]
            const coordinates = (event.features[0].geometry as GeoJSON.Point).coordinates as [number, number];
            while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            
            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setText(event.features[0].properties.title)
                .addTo(this.ctrl);
            this.events.focus(event.features[0].properties.id);
        });
    }

    private static generateGeoJSON(nominations: Array<Nomination>, codes: Array<number>) {
        const geoJson: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
            type: 'FeatureCollection', features: [],
        };
        if (codes.length < 1) return geoJson;
        for (const nomination of nominations) {
            if (!codes.includes(nomination.status.code)) continue;
            if (!nomination.lngLat) continue;
            geoJson.features.push({
                type: 'Feature',
                properties: {
                    id: nomination.id,
                    title: nomination.title,
                    status: nomination.status
                },
                geometry: {
                    type: 'Point',
                    coordinates: [nomination.lngLat.lng, nomination.lngLat.lat],
                }
            });
        }
        return geoJson;
    }
}

export default MapCard;
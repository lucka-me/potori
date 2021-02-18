import { eli } from '@lucka-labs/eli';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { base } from 'ui/dashboard/base';
import { eliCard } from 'eli/card';
import { umi } from 'service/umi';
import Nomination, { LngLat } from 'service/nomination';

import './style.scss';

type StatusFilterMap = Map<umi.StatusCode, boolean>;
type ReasonFilterMap = Map<umi.ReasonCode, boolean>;

interface MapCardEvents {
    focus: (id: string) => void,
    styleLoaded: () => Array<Nomination>,
}

class MapCard extends base.CardPrototype {

    ctrl: mapboxgl.Map = null;
    events: MapCardEvents = {
        focus: () => { },
        styleLoaded: () => [],
    }
    private statusFilter: StatusFilterMap = new Map();
    private reasonFilter: ReasonFilterMap = new Map();
    private tasks: Array<() => void> = [];

    constructor() {
        super();
        for (const code of umi.status.keys()) {
            this.statusFilter.set(code, true);
        }
        for (const [code,reason] of umi.reason) {
            this.reasonFilter.set(code, true);
        }
    }

    render() {
        const elementMap = eli('div', { });
        this.root = eliCard('map-card', [ elementMap ]);
        this.parent.append(this.root);

        mapboxgl.accessToken = 'pk.eyJ1IjoibHVja2EtbWUiLCJhIjoiY2p2NDk5NmRvMHFreTQzbzduemM1MHV4cCJ9.7XGmxnEJRoCDr-i5BBmBfw';
        this.ctrl = new mapboxgl.Map({
            container: elementMap,
            style: MapCard.getStyle(),
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
            umi.StatusCode.Accepted,
            this.generateGeoJSON(nominations, umi.StatusCode.Accepted)
        );
        this.updateSource(
            umi.StatusCode.Pending,
            this.generateGeoJSON(nominations, umi.StatusCode.Pending)
        );
    }

    updateStyle() {
        if (!this.loaded) {
            this.tasks.push(() => this.updateStyle());
            return;
        }
        this.ctrl.setStyle(MapCard.getStyle());
        this.update(this.events.styleLoaded());
    }

    filter(status: StatusFilterMap, reason: ReasonFilterMap) {
        this.statusFilter = status;
        this.reasonFilter = reason;

        if (!this.loaded) {
            this.tasks.push(() => this.filter(status, reason));
            return;
        }

        for (const [code, visible] of this.statusFilter) {
            const visibility = visible ? 'visible' : 'none';
            this.ctrl.setLayoutProperty(`potori-${code}-cluster`    , 'visibility', visibility);
            this.ctrl.setLayoutProperty(`potori-${code}-count`      , 'visibility', visibility);
            this.ctrl.setLayoutProperty(`potori-${code}-unclustered`, 'visibility', visibility);
        }
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
        this.updateSource(
            umi.StatusCode.Rejected,
            this.generateGeoJSON(nominations, umi.StatusCode.Rejected)
        );
    }

    private executeTasks() {
        const count = this.tasks.length;
        for (let i = 0; i < count; i++) {
            this.tasks.shift()();
        }
    }

    private updateSource(status: umi.StatusCode, data: GeoJSON.FeatureCollection<GeoJSON.Geometry>) {
        const id = `potori-${status}`;
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
        const color = style.getPropertyValue(`--color-${status}`);
        const colorDark = style.getPropertyValue(`--color-${status}--dark`);
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

    private generateGeoJSON(nominations: Array<Nomination>, status: umi.StatusCode) {
        const geoJson: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
            type: 'FeatureCollection', features: [],
        };
        let undeclaredVisible = (status === umi.StatusCode.Rejected) && this.reasonFilter.get(umi.Reason.undeclared);
        for (const nomination of nominations) {
            if (nomination.status !== status) continue;
            if (!nomination.lngLat) continue;
            if (status === umi.StatusCode.Rejected) {
                if (nomination.reasons.length > 0) {
                    let visible = false;
                    for (const code of nomination.reasons) {
                        if (!this.reasonFilter.get(code)) continue;
                        visible = true;
                        break;
                    }
                    if (!visible) continue;
                } else if (!undeclaredVisible) {
                    continue;
                }
            }
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

    private static getStyle() {
        return `mapbox://styles/mapbox/${getComputedStyle(document.documentElement).getPropertyValue('--map-style').trim()}?optimize=true`;
    }
}

export default MapCard;
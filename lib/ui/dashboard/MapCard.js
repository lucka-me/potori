import { DashboardPrototype } from './prototypes.js';
import { Eli } from "../Eli.js";
import Dark from '../Dark.js';
import FilterCard from './FilterCard.js';

class MapCard extends DashboardPrototype {
    constructor() {
        super();
        this.ctrl = null;

        this.event = {
            focus: (id) => { id },
        }
    }

    init(parent) {
        const elementMap = Eli.build('div', {
            styleText: [
                'width: 100%',
                'height: 100%',
                'clip-path: inset(100% round 4px)',
                '-webkit-clip-path: inset(0 round 4px)',
            ].join(';'),
        });
        this.root = Eli.build('div', {
            className: 'mdc-card mdc-card--outlined flex--3 flex-shrink--1',
            styleText: 'min-width: 300px;',
            children: [ elementMap ],
        });
        parent.appendChild(this.root);

        this.ctrl = new mapboxgl.Map({ 
            container: elementMap,
            style: value.string.mapbox.style[Dark.enabled ? 'dark' : 'default']
        });
        this.ctrl.once('load', () => this.ctrl.resize());
        this.ctrl.addControl(new mapboxgl.NavigationControl());
        this.ctrl.addControl(new mapboxgl.FullscreenControl());
    }

    loaded() {
        return this.ctrl && this.ctrl.isStyleLoaded();
    }

    update(portals) {
        this.updateRejected(portals);
        this.updateSource(
            'accepted',
            MapCard.generateGeoJSON(portals, [ value.data.type.accepted.code ])
        );
        this.updateSource(
            'pending',
            MapCard.generateGeoJSON(portals, [ value.data.type.pending.code ])
        );
    }

    updateRejected(portals) {
        const codes = [];
        for (const key of Object.keys(FilterCard.reason)) {
            if (!FilterCard.reason[key].checked) continue;
            codes.push(value.data.reason[key].code);
        }
        this.updateSource('rejected', MapCard.generateGeoJSON(portals, codes));
    }

    static generateGeoJSON(portals, codes) {
        const geoJson = { type: 'FeatureCollection', features: [], };
        if (codes.length < 1) return geoJson;
        for (const portal of portals) {
            if (!codes.includes(portal.status)) continue;
            if (!portal.lngLat) continue;
            geoJson.features.push({
                type: 'Feature',
                properties: {
                    id: portal.id,
                    title: portal.title,
                    status: portal.status
                },
                geometry: {
                    type: 'Point',
                    coordinates: [portal.lngLat.lng, portal.lngLat.lat]
                }
            });
        }
        return geoJson;
    }

    updateSource(type, data) {
        const id = `potori-${type}`;
        const source = this.ctrl.getSource(id);
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
                'text-color': Dark.enabled ? '#FFF' : '#000',
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
            this.ctrl.getSource(id).getClusterExpansionZoom(
                clusterId,
                (err, zoom) => {
                    if (err) return;
                    this.ctrl.easeTo({ center: features[0].geometry.coordinates, zoom: zoom});
                }
            );
        });

        this.ctrl.on('click', `${id}-unclustered`, event => {
            const coordinates = event.features[0].geometry.coordinates.slice();
            while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            
            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setText(event.features[0].properties.title)
                .addTo(this.ctrl);
            this.event.focus(event.features[0].properties.id);
        });
    }

    updateStyle() {
        if (!this.loaded()) return;
        this.ctrl.setStyle(value.string.mapbox.style[Dark.enabled ? 'dark' : 'default']);
        this.ctrl.once('render', () => this.update());
    }

    setTypeVisible(type, visible) {
        const visibility = visible ? 'visible' : 'none';
        this.ctrl.setLayoutProperty(`potori-${type}-cluster`    , 'visibility', visibility);
        this.ctrl.setLayoutProperty(`potori-${type}-count`      , 'visibility', visibility);
        this.ctrl.setLayoutProperty(`potori-${type}-unclustered`, 'visibility', visibility);
    }

    setVisible(_) { }
}

export { MapCard };
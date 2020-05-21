const mapKit = {
    ctrl: null,
    load: () => {
        mapboxgl.accessToken = value.string.mapbox.accessToken;
        mapKit.ctrl = new mapboxgl.Map({ 
            container: 'map-card-map',
            style: ui.dark.enabled ? value.string.mapbox.style.dark : value.string.mapbox.style.default
        });
        mapKit.ctrl.once('load', () => mapKit.ctrl.resize());
        mapKit.ctrl.addControl(new mapboxgl.NavigationControl());
        mapKit.ctrl.addControl(new mapboxgl.FullscreenControl());
    },
    isLoaded: () => {
        return mapKit.ctrl && mapKit.ctrl.isStyleLoaded();
    },
    generateGeoJSON: (codes) => {
        const geoJson = { type: 'FeatureCollection', features: [], };
        if (codes.length < 1) return geoJson;
        for (const portal of process.portals) {
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
    },
    updateSource: (type, data) => {
        const id = `potori-${type}`;
        const source = mapKit.ctrl.getSource(id);
        if (source) {
            source.setData(data);
        } else {
            mapKit.ctrl.addSource(id, {
                type: 'geojson',
                data: data,
                cluster: true,
            });
            const style = getComputedStyle(document.documentElement);
            const color = style.getPropertyValue(`--color-${type}`);
            const colorDark = style.getPropertyValue(`--color-${type}--dark`);
            mapKit.ctrl.addLayer({
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
            mapKit.ctrl.addLayer({
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
                    'text-color': ui.dark.enabled ? '#FFF' : '#000',
                }
            });
            mapKit.ctrl.addLayer({
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

            mapKit.ctrl.on('click', `${id}-cluster`, event => {
                const features = mapKit.ctrl.queryRenderedFeatures(
                    event.point, { layers: [`${id}-cluster`] }
                );
                const clusterId = features[0].properties.cluster_id;
                mapKit.ctrl.getSource(id).getClusterExpansionZoom(
                    clusterId,
                    (err, zoom) => {
                        if (err) return;
                        mapKit.ctrl.easeTo({ center: features[0].geometry.coordinates, zoom: zoom});
                    }
                );
            });

            mapKit.ctrl.on('click', `${id}-unclustered`, event => {
                const coordinates = event.features[0].geometry.coordinates.slice();
                while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
                }
                
                new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setText(event.features[0].properties.title)
                    .addTo(mapKit.ctrl);
                ui.cardList.scrollTo(
                    0,
                    document.getElementById(`card-${event.features[0].properties.id}`).offsetTop - ui.cardList.offsetTop - 8);
            });
        }
    },
    updateData: () => {
        mapKit.updateRejectedData();
        mapKit.updateSource(
            'accepted',
            mapKit.generateGeoJSON([ value.data.type.accepted.code ])
        );
        mapKit.updateSource(
            'pending',
            mapKit.generateGeoJSON([ value.data.type.pending.code ])
        );
    },
    updateRejectedData: () => {
        const codes = [];
        for (const key of Object.keys(dashboard.filter.rejectedReason)) {
            if (!dashboard.filter.rejectedReason[key].switch.checked) continue;
            codes.push(value.data.rejectedReason[key].code);
        }
        mapKit.updateSource('rejected', mapKit.generateGeoJSON(codes));
    },
    setVisible: (type, visible) => {
        const visibility = visible ? 'visible' : 'none'
        mapKit.ctrl.setLayoutProperty(`potori-${type}-cluster`      , 'visibility', visibility);
        mapKit.ctrl.setLayoutProperty(`potori-${type}-count`        , 'visibility', visibility);
        mapKit.ctrl.setLayoutProperty(`potori-${type}-unclustered`  , 'visibility', visibility);
    },
};
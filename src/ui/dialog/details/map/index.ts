import i18next from 'i18next';
import mapboxgl from 'mapbox-gl';
import { MDCRipple } from '@material/ripple';

import { base } from 'ui/base';
import { eli } from '@lucka-labs/eli';
import { eliIcon } from 'eli/icon';
import { eliIconButton } from 'eli/icon-button';
import { LngLat } from 'service/nomination';
import { QueryFailReason } from 'service/brainstorming';

import './style.scss';

type MessageCallback = (message: string) => void;
type QueryFailCallback = (reason: QueryFailReason) => void;
type QuerySucceedCallback = (lngLat: LngLat) => void;
type QueryLocationCallback = (succeed: QuerySucceedCallback, failed: QueryFailCallback) => void;

interface DetailsDialogMapEvents {
    alert: MessageCallback;
    queryLngLat: QueryLocationCallback;
}

interface MapButton {
    ctrl: MDCRipple,
    icon: string,
    clicked: () => void,
}

export default class DetailsDialogMap extends base.Prototype {

    private ctrl: mapboxgl.Map = null;
    private marker: mapboxgl.Marker = null;
    private buttons = {
        edit: {
            ctrl: null,
            icon: eliIcon.Icon.edit,
            clicked: () => this.edit(),
        } as MapButton,
        search: {
            ctrl: null,
            icon: eliIcon.Icon.search,
            clicked: () => this.search(),
        } as MapButton,
        delete: {
            ctrl: null,
            icon: eliIcon.Icon.trash,
            clicked: () => this.delete(),
        } as MapButton,
    };

    opened = false;

    events: DetailsDialogMapEvents = {
        alert: () => { },
        queryLngLat: () => { },
    };

    init(parent: HTMLElement) {
        super.init(parent);
        this.render();
    }

    render() {
        const elementMap = eli('div', { className: 'map' });

        this.parent.append(eli('div', {
            className: 'details-map',
        }, [
            eli(
                'div', { className: 'buttons' },
                Object.values(this.buttons).map((button) => {
                    const element = eliIconButton(button.icon);
                    button.ctrl = new MDCRipple(element);
                    button.ctrl.unbounded = true;
                    button.ctrl.listen('click', button.clicked);
                    return element;
                })
            ),
            elementMap,
        ]));

        this.ctrl = new mapboxgl.Map({
            container: elementMap,
            style: DetailsDialogMap.style,
        });
        this.ctrl.addControl(new mapboxgl.NavigationControl());
    }

    updateStyle() {
        if (!this.ctrl) return;
        this.ctrl.setStyle(DetailsDialogMap.style);
    }

    set lngLat(lngLat: LngLat | null) {
        this.delete();
        if (lngLat) {
            import(
                /* webpackChunkName: 'modules-async' */
                'mapbox-gl'
            ).then((mapboxgl) => {
                this.marker = new mapboxgl.Marker()
                    .setLngLat(lngLat).addTo(this.ctrl);
                this.ctrl.jumpTo({ center: lngLat, zoom: 16 });
                this.buttons.delete.ctrl.disabled = false;
                this.buttons.edit.ctrl.root.innerHTML = eliIcon.Icon.edit;
            });
        }
        this.buttons.search.ctrl.disabled = false;
    }

    get lngLat(): LngLat | null {
        if (!this.marker) return null;
        return this.marker.getLngLat();
    }

    layout() {
        this.ctrl.resize();
        for (const button of Object.values(this.buttons)) {
            button.ctrl.layout();
        }
    }

    private edit() {
        if (!this.marker) {
            import(
                /* webpackChunkName: 'modules-async' */
                'mapbox-gl'
            ).then((mapboxgl) => {
                this.marker = new mapboxgl.Marker()
                    .setLngLat(this.ctrl.getCenter())
                    .setDraggable(true)
                    .addTo(this.ctrl);
                this.buttons.delete.ctrl.disabled = false;
                this.buttons.edit.ctrl.root.innerHTML = eliIcon.Icon.edit;
            });
        } else {
            this.marker.setDraggable(true);
        }
    }

    private search() {
        const succeed = (lngLat: LngLat) => {
            if (!this.opened) return;
            if (!this.marker) {
                import(
                    /* webpackChunkName: 'modules-async' */
                    'mapbox-gl'
                ).then((mapboxgl) => {
                    this.marker = new mapboxgl.Marker()
                        .setLngLat(lngLat)
                        .setDraggable(false)
                        .addTo(this.ctrl);
                });
            } else {
                this.marker.setLngLat(lngLat);
                this.marker.setDraggable(false);
            }
            this.ctrl.easeTo({ center: lngLat, zoom: 16 });
            this.buttons.edit.ctrl.root.innerHTML = eliIcon.Icon.edit;
            this.buttons.search.ctrl.disabled = false;
            this.buttons.delete.ctrl.disabled = false;
        };
        const failed = (reason: QueryFailReason) => {
            if (!this.opened) return;
            this.events.alert(i18next.t(reason))
            this.buttons.search.ctrl.disabled = false;
        }
        this.buttons.search.ctrl.disabled = true;
        this.events.queryLngLat(succeed, failed);
    }

    private delete() {
        if (this.marker) this.marker.remove();
        this.marker = null;
        this.buttons.edit.ctrl.root.innerHTML = eliIcon.Icon.plus;
        this.buttons.delete.ctrl.disabled = true;
    }

    private static get style() {
        return `mapbox://styles/mapbox/${getComputedStyle(document.documentElement).getPropertyValue('--map-style').trim()}?optimize=true`;
    }
}
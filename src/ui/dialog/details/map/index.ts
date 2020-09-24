import i18next from 'i18next';
import mapboxgl from 'mapbox-gl';
import { MDCRipple } from '@material/ripple';
import { MDCDialog } from '@material/dialog';

import { eli } from 'ui/eli';
import Nomination, { LngLat } from 'service/nomination';
import { QueryFailReason } from 'service/brainstorming';
import UIPrototype from 'ui/base';

import './style.scss';

interface DetailsDialogMapEvents {
    alert: (message: string) => void;
    queryLngLat: (bsId: string, succeed: (lngLat: LngLat) => void, failed: (reason: QueryFailReason) => void) => void;
}

export default class DetailsDialogMap extends UIPrototype {

    ctrl: mapboxgl.Map = null;
    marker: mapboxgl.Marker = null;
    dialog: MDCDialog = null;
    nomination: Nomination = null;
    buttons = {
        edit: {
            root: null as HTMLButtonElement,
            icon: '\uf044',
            clicked: () => this.edit(),
        },
        search: {
            root: null as HTMLButtonElement,
            icon: '\uf002',
            clicked: () => this.search(),
        },
        delete: {
            root: null as HTMLButtonElement,
            icon: '\uf1f8',
            clicked: () => this.delete(),
        },
    };

    events: DetailsDialogMapEvents = {
        alert: () => { },
        queryLngLat: () => { },
    };

    init(parent: HTMLElement) {
        super.init(parent);
        this.render();
    }

    render() {
        const mapButtons = [];
        for (const value of Object.values(this.buttons)) {
            value.root = eli.build('button', {
                className: 'fa mdc-icon-button',
                innerHTML: value.icon,
            });
            const ctrl = new MDCRipple(value.root);
            ctrl.unbounded = true;
            ctrl.listen('click', value.clicked);
            mapButtons.push(value.root);
        }
        const elementMap = eli.build('div', {
            className: 'flex-grow--1',
            cssText: 'min-height: 180px',
        });

        const elementContent = eli.build('div', {
            className: 'flex-box-row--nowrap margin-v--8',
        }, [
            eli.build('div', {
                className: 'flex-box-col flex-justify-content--around',
            }, mapButtons),
            elementMap,
        ]);

        this.parent.append(elementContent);

        this.ctrl = new mapboxgl.Map({
            container: elementMap,
            style: DetailsDialogMap.getStyle(),
        });
        this.ctrl.addControl(new mapboxgl.NavigationControl());
    }

    set(nomination: Nomination) {
        this.nomination = nomination;
        this.delete();
        if (this.nomination.lngLat) {
            import(
                /* webpackChunkName: 'modules-async' */
                'mapbox-gl'
            ).then((mapboxgl) => {
                this.marker = new mapboxgl.Marker()
                    .setLngLat(this.nomination.lngLat).addTo(this.ctrl);
                this.ctrl.jumpTo({ center: this.nomination.lngLat, zoom: 16 });
                this.buttons.delete.root.disabled = false;
                this.buttons.edit.root.innerHTML = '\uf044';
            });
        }
        this.buttons.search.root.disabled = false;
    }

    edit() {
        if (!this.marker) {
            import(
                /* webpackChunkName: 'modules-async' */
                'mapbox-gl'
            ).then((mapboxgl) => {
                this.marker = new mapboxgl.Marker()
                    .setLngLat(this.ctrl.getCenter())
                    .setDraggable(true)
                    .addTo(this.ctrl);
                this.buttons.delete.root.disabled = false;
                this.buttons.edit.root.innerHTML = '\uf044';
            });
        } else {
            this.marker.setDraggable(true);
        }
    }

    search() {
        const succeed = (lngLat: LngLat) => {
            if (!this.dialog.isOpen) return;
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
            this.buttons.edit.root.innerHTML = '\uf044';
            this.buttons.search.root.disabled = false;
            this.buttons.delete.root.disabled = false;
        };
        const failed = (reason: QueryFailReason) => {
            if (!this.dialog.isOpen) return;
            const message = '';
            switch(reason) {
                case QueryFailReason.FIREBASE_ERROR: {
                    this.events.alert(i18next.t('message:Failed to query Firebase'));
                    break;
                }
                case QueryFailReason.NOT_EXIST: {
                    this.events.alert(i18next.t('message:Nomination not exists in database'));
                    break;
                }
                default:
            }
            this.buttons.search.root.disabled = false;
        }
        this.buttons.search.root.disabled = true;
        this.events.queryLngLat(this.nomination.id, succeed, failed);
    }

    delete() {
        if (this.marker) this.marker.remove();
        this.marker = null;
        this.buttons.edit.root.innerHTML = '\uf067';
        this.buttons.delete.root.disabled = true;
    }

    updateStyle() {
        if (!this.ctrl) return;
        this.ctrl.setStyle(DetailsDialogMap.getStyle());
    }

    private static getStyle() {
        return `mapbox://styles/mapbox/${getComputedStyle(document.documentElement).getPropertyValue('--map-style').trim()}?optimize=true`;
    }
}
import * as mapboxgl from 'mapbox-gl';

import Eli from "./Eli";

import AppBar, { AppBarMenuItems, AppBarActions } from './AppBar';
import Dark         from "./Dark";
import Progress     from './Progress';
import Dashboard    from './Dashboard';
import ListView     from './ListView';
import Dialog       from './Dialog';

import Service from "../service/Service";
import StatusKit from "../service/StatusKit";

class UIKit {
    constructor() {
        this.dark       = Dark;
        this.appBar     = new AppBar();
        this.progress   = new Progress();
        this.dashboard  = new Dashboard();
        this.list       = new ListView();
        this.dialog     = new Dialog();
    }

    init() {
        mapboxgl.accessToken = 'pk.eyJ1IjoibHVja2EtbWUiLCJhIjoiY2p2NDk5NmRvMHFreTQzbzduemM1MHV4cCJ9.7XGmxnEJRoCDr-i5BBmBfw';

        const body = document.body;
        body.className = 'mdc-typography fullheight flex-box-col';

        // Dark
        this.dark.changed = () => {
            this.dashboard.updateStyle();
            this.dialog.details.updateStyle();
        };
        this.dark.init();

        // AppBar
        this.appBar.events.set('view'   , () => this.switchView());
        this.appBar.events.set('signin' , () => Service.auth.signIn());

        this.appBar.menu.events.set(
            AppBarMenuItems.open.key, () => Service.open()
        );
        this.appBar.menu.events.set(
            AppBarMenuItems.save.key, () => Service.save()
        );
        this.appBar.menu.events.set(
            AppBarMenuItems.upload.key, () => Service.upload()
        );
        this.appBar.menu.events.set(
            AppBarMenuItems.import.key, () => this.dialog.import.open()
        );
        this.appBar.menu.events.set(
            AppBarMenuItems.about.key, () => this.dialog.about.open()
        );
        this.appBar.menu.events.set(
            AppBarMenuItems.signout.key, () => Service.auth.signOut()
        );
        this.appBar.init(body);

        // Progress
        this.progress.init(body);

        // MainBox
        const mainBox = Eli.build('div', {
            className: [
                'flex--1',
                'flex-box-row--wrap',
                'main-box'
            ].join(' '),
            styleText: [
                'min-height: 0%',
            ].join(';'),
        });
        body.appendChild(mainBox);

        // Dashboard
        this.dashboard.map.events.focus = (id) => {
            const top = this.list.root.offsetTop + 8;
            this.list.root.scrollTo(
                0, document.getElementById(`card-${id}`).offsetTop - top
            );
        }
        this.dashboard.map.events.styleLoaded = () => {
            return Service.nominations;
        }
        this.dashboard.filter.events.switchType = (type, visible) => {
            for (const nomination of Service.nominations) {
                if (StatusKit.typeMatched(nomination.status.code, type.code)) {
                    document.getElementById(`card-${nomination.id}`).hidden = !visible;
                }
            }
            if (type === 'rejected') {
                this.dashboard.map.updateRejected(Service.nominations);
            }
            this.dashboard.map.setTypeVisible(type, visible);
        };
        this.dashboard.filter.events.switchReason = (reason, visible) => {
            for (const nomination of Service.nominations) {
                if (nomination.status.code !== reason.code) continue;
                document.getElementById(`card-${nomination.id}`).hidden = !visible;
            }
            this.dashboard.map.updateRejected(Service.nominations);
        };
        this.dashboard.init(mainBox);

        // List
        this.list.events.focus = (portal) => {
            this.dashboard.map.ctrl.easeTo({ center: portal.lngLat });
        }
        this.list.events.openDetails = (portal) => {
            this.dialog.details.open(portal);
        }
        this.list.init(mainBox);

        // Dialog
        this.dialog.details.events.update = (portal) => {
            this.update(portal);
        }
        this.dialog.init(body);
    }

    linkService() {
        // Service
        Service.events.authStatusChanged = (signedIn) => {
            if (signedIn) {
                this.appBar.actions.get(AppBarActions.signin.key).hidden = true;
                this.appBar.menu.items.get(AppBarMenuItems.signout.key).hidden = false;
            } else {
                this.clear();
                this.appBar.actions.get(AppBarActions.signin.key).hidden = false;
                this.appBar.menu.items.get(AppBarMenuItems.signout.key).hidden = true;
                this.appBar.menu.items.get(AppBarMenuItems.upload.key).hidden = true;
                this.appBar.menu.items.get(AppBarMenuItems.import.key).hidden = true;
            }
        }
        Service.events.progressUpdate = (percent) => {
            this.progress.ctrl.progress = percent;
        }
        Service.events.updateBs = () => {
            this.dashboard.bs.update(Service.nominations);
        }
        Service.events.showProgress = () => {
            this.progress.ctrl.root_.hidden = false;
        };
        Service.events.show = () => {
            this.show();
        };
        Service.events.clear = () => {
            this.clear();
        };
        Service.events.alert = (message) => {
            this.dialog.alert.open(message);
        }
        Service.events.info = (message) => {
            this.dialog.shackbar.open(message);
        }

        // Mari
        Service.mari.events.bufferUpdate = (percent) => {
            this.progress.ctrl.buffer = percent;
        };
        Service.mari.events.progressUpdate = (percent) => {
            this.progress.ctrl.progress = percent * 0.9;
        }
    }

    switchView() {
        const actionView = this.appBar.actions.get(AppBarActions.view.key);
        const switchToList = actionView.innerHTML === 'view_list';
        actionView.innerHTML = switchToList ? 'dashboard' : 'view_list';
        actionView.title = switchToList ? 'Dashboard' : 'List';
        this.dashboard.root.classList.toggle('view-hide');
        this.list.root.classList.toggle('view-hide');
    }

    clear() {
        this.appBar.menu.items.get(AppBarMenuItems.open.key).hidden = false;
        this.appBar.menu.items.get(AppBarMenuItems.save.key).hidden = true;

        this.dashboard.setVisible(false);
        this.list.clear();
        if (this.dashboard.map.loaded) this.dashboard.map.update(Service.nominations);
        this.progress.ctrl.root_.hidden = true;
        this.progress.ctrl.buffer = 0;
        this.progress.ctrl.progress = 0;
    }

    show() {
        const boundsNE = { lng: -181.0, lat: -91.0 };
        const boundsSW = { lng:  181.0, lat:  91.0 };
        for (const portal of Service.nominations) {
            if (!portal.lngLat) continue;
            if (portal.lngLat.lng > boundsNE.lng) boundsNE.lng = portal.lngLat.lng;
            else if (portal.lngLat.lng < boundsSW.lng) boundsSW.lng = portal.lngLat.lng;
            if (portal.lngLat.lat > boundsNE.lat) boundsNE.lat = portal.lngLat.lat;
            else if (portal.lngLat.lat < boundsSW.lat) boundsSW.lat = portal.lngLat.lat;
        }
        this.list.show(Service.nominations);
        this.dashboard.refresh(Service.nominations);
        this.dashboard.setVisible(true);
        if (boundsSW.lng > -181) {
            this.dashboard.map.ctrl.fitBounds([boundsSW, boundsNE], { linear: true });
        }
        this.appBar.menu.items.get(AppBarMenuItems.open.key).hidden = true;
        this.appBar.menu.items.get(AppBarMenuItems.save.key).hidden = false;
        this.appBar.menu.items.get(AppBarMenuItems.upload.key).hidden = !Service.auth.signedIn;
        this.appBar.menu.items.get(AppBarMenuItems.import.key).hidden = false;
        this.progress.ctrl.root_.hidden = true;
    }

    update(portal) {
        this.list.update(portal);
        this.dashboard.update(portals);
    }
}

export default UIKit;
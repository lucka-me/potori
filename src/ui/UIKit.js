import Eli from "./Eli.js";

import Dark         from "./Dark.js";
import AppBar       from './AppBar.js';
import Progress     from './Progress.js';
import Dashboard    from './Dashboard.js';
import ListView     from './ListView.js';
import Dialog       from './Dialog.js';

import Service from "../service/Service.js";
import StatusKit from "../service/StatusKit.js";

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
        this.appBar.event.view              = () => this.switchView();
        this.appBar.event.signin            = () => Service.auth.signIn();
        this.appBar.menu.event.openFile     = () => Service.open(),
        this.appBar.menu.event.saveFile     = () => Service.save(),
        this.appBar.menu.event.uploadFile   = () => Service.upload(),
        this.appBar.menu.event.import       = () => this.dialog.import.open(),
        this.appBar.menu.event.about        = () => this.dialog.about.open(),
        this.appBar.menu.event.signout      = () => Service.auth.signOut();
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
        this.dashboard.map.event.focus = (id) => {
            const top = this.list.root.offsetTop + 8;
            this.list.root.scrollTo(
                0, document.getElementById(`card-${id}`).offsetTop - top
            );
        }
        this.dashboard.filter.event.switchType = (type, visible) => {
            const code = StatusKit.types.get(type).code;
            for (const portal of Service.portals) {
                if (StatusKit.typeMatched(portal.status, code)) {
                    document.getElementById(`card-${portal.id}`).hidden = !visible;
                }
            }
            if (type === 'rejected') {
                this.dashboard.map.updateRejected(Service.portals);
            }
            this.dashboard.map.setTypeVisible(type, visible);
        };
        this.dashboard.filter.event.switchReason = (reason, visible) => {
            for (const portal of Service.portals) {
                if (portal.status !== StatusKit.reasons.get(reason).code) continue;
                document.getElementById(`card-${portal.id}`).hidden = !visible;
            }
            this.dashboard.map.updateRejected(Service.portals);
        };
        this.dashboard.init(mainBox);

        // List
        this.list.event.focus = (portal) => {
            this.dashboard.map.ctrl.easeTo({ center: portal.lngLat });
        }
        this.list.event.openDetails = (portal) => {
            this.dialog.details.open(portal);
        }
        this.list.init(mainBox);

        // Dialog
        this.dialog.details.event.update = (portal) => {
            this.update(portal);
        }
        this.dialog.init(body);
    }

    linkService() {
        // Service
        Service.event.authStatusChanged = (signedIn) => {
            if (signedIn) {
                this.appBar.button.signin.root_.hidden = true;
                this.appBar.menu.item.signout.hidden = false;
            } else {
                this.clear();
                this.appBar.button.signin.root_.hidden = false;
                this.appBar.menu.item.signout.hidden = true;
                this.appBar.menu.item.uploadFile.hidden = true;
                this.appBar.menu.item.import.hidden = true;
            }
        }
        Service.event.progressUpdate = (percent) => {
            this.progress.ctrl.progress = percent;
        }
        Service.event.updateBs = () => {
            this.dashboard.bs.update(Service.portals);
        }
        Service.event.showProgress = () => {
            this.progress.ctrl.root_.hidden = false;
        };
        Service.event.show = () => {
            this.show();
        };
        Service.event.clear = () => {
            this.clear();
        };
        Service.event.alert = (message) => {
            this.dialog.alert.open(message);
        }
        Service.event.info = (message) => {
            this.dialog.shackbar.open(message);
        }

        // Mari
        Service.mari.event.bufferUpdate = (percent) => {
            this.progress.ctrl.buffer = percent;
        };
        Service.mari.event.progressUpdate = (percent) => {
            this.progress.ctrl.progress = percent * 0.9;
        }
    }

    switchView() {
        const switchToList = this.appBar.button.view.root_.innerHTML === 'view_list';
        this.appBar.button.view.root_.innerHTML = switchToList ? 'dashboard' : 'view_list';
        this.appBar.button.view.root_.title = switchToList ? 'Dashboard' : 'List';
        document.querySelector('#dashboard').classList.toggle('view-hide');
        this.dashboard.root.classList.toggle('view-hide');
        this.list.root.classList.toggle('view-hide');
    }

    clear() {
        this.appBar.menu.item.openFile.hidden = false;
        this.appBar.menu.item.saveFile.hidden = true;

        this.dashboard.setVisible(false);
        this.list.clear();
        if (this.dashboard.map.loaded()) this.dashboard.map.update(Service.portals);
        this.progress.ctrl.root_.hidden = true;
        this.progress.ctrl.buffer = 0;
        this.progress.ctrl.progress = 0;
    }

    show() {
        const boundsNE = { lng: -181.0, lat: -91.0 };
        const boundsSW = { lng:  181.0, lat:  91.0 };
        for (const portal of Service.portals) {
            if (!portal.lngLat) continue;
            if (portal.lngLat.lng > boundsNE.lng) boundsNE.lng = portal.lngLat.lng;
            else if (portal.lngLat.lng < boundsSW.lng) boundsSW.lng = portal.lngLat.lng;
            if (portal.lngLat.lat > boundsNE.lat) boundsNE.lat = portal.lngLat.lat;
            else if (portal.lngLat.lat < boundsSW.lat) boundsSW.lat = portal.lngLat.lat;
        }
        this.list.show(Service.portals);
        this.dashboard.refresh(Service.portals);
        this.dashboard.setVisible(true);
        if (boundsSW.lng > -181) {
            this.dashboard.map.ctrl.fitBounds([boundsSW, boundsNE], { linear: true });
        }
        this.appBar.menu.item.openFile.hidden = true;
        this.appBar.menu.item.saveFile.hidden = false;
        this.appBar.menu.item.uploadFile.hidden = !gapi.auth2.getAuthInstance().isSignedIn.get();
        this.appBar.menu.item.import.hidden = false;
        this.progress.ctrl.root_.hidden = true;
    }

    update(portal) {
        this.list.update(portal);
        this.dashboard.update(portals);
    }
}

export default UIKit;
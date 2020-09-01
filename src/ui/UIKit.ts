import i18next from 'i18next';
import mapboxgl from 'mapbox-gl';

import AppBar, { AppBarMenuItems, AppBarActions } from './AppBar';
import Dark         from "./Dark";
import Dashboard    from './Dashboard';
import Dialog       from './Dialog';
import Eli          from "./Eli";
import ListView     from './ListView';
import Progress     from './Progress';
import Service      from "../service/Service";
import Snackbar     from './Snackbar';
import StatusKit    from "../service/StatusKit";
import Nomination   from '../service/Nomination';

class UIKit {

    appBar      = new AppBar();
    progress    = new Progress();
    dashboard   = new Dashboard();
    list        = new ListView();
    dialog      = new Dialog();
    snackbar    = Snackbar;

    dark        = new Dark();

    init() {
        document.documentElement.lang = i18next.language;
        mapboxgl.accessToken = 'pk.eyJ1IjoibHVja2EtbWUiLCJhIjoiY2p2NDk5NmRvMHFreTQzbzduemM1MHV4cCJ9.7XGmxnEJRoCDr-i5BBmBfw';

        const body = document.body;
        body.className = 'mdc-typography fullheight flex-box-col';

        // AppBar
        this.appBar.events.set(AppBarActions.view.key   , () => this.switchView());
        this.appBar.events.set(AppBarActions.signin.key , () => Service.auth.signIn());
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
            cssText: [
                'min-height: 0%',
            ].join(';'),
        });
        body.append(mainBox);

        // Snackbar
        this.snackbar.init(body);

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
            if (type.key === 'rejected') {
                this.dashboard.map.updateRejected(Service.nominations);
            }
            this.dashboard.map.setTypeVisible(type.key, visible);
        };
        this.dashboard.filter.events.switchReason = (reason, visible) => {
            for (const nomination of Service.nominations) {
                if (nomination.status.code !== reason.code) continue;
                document.getElementById(`card-${nomination.id}`).hidden = !visible;
            }
            this.dashboard.map.updateRejected(Service.nominations);
        };
        this.dashboard.bs.events.analyse = (nominations) => {
            return Service.bs.analyse(nominations);
        }
        this.dashboard.bs.basic.events = {
            refresh: () => {
                Service.updateBsData();
            },
            clear: () => {
                Service.clearBsData();
                this.dashboard.bs.update([]);
            }
        }
        this.dashboard.init(mainBox);

        // List
        this.list.events.focus = (nomination) => {
            this.dashboard.map.easeTo(nomination.lngLat);
        }
        this.list.events.openDetails = (nomination) => {
            this.dialog.details.open(nomination);
        }
        this.list.init(mainBox);

        // Dialog
        this.dialog.details.events.update = (nomination) => {
            this.update(nomination);
        };
        this.dialog.details.events.query = (bsId, succeed, failed) => {
            Service.bs.query(bsId, succeed, failed);
        };
        this.dialog.details.map.events.queryLngLat = (bsId, succeed, failed) => {
            Service.bs.queryLngLat(bsId, succeed, failed);
        };
        this.dialog.import.events.import = (raw) => {
            Service.import(raw);
        };
        this.dialog.init(body);

        // Dark
        this.dark.changed = () => {
            this.dashboard.updateStyle();
            this.dialog.details.updateStyle();
        };
        this.dark.init(body);
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
            this.progress.root.hidden = false;
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
            this.snackbar.show(message);
        }
        // FileKit
        Service.file.local.events.openUI = (opened) => {
            this.openFileUI(opened);
        }
        Service.file.local.events.saveUI = (filename, href) => {
            this.saveFileUI(filename, href);
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
        this.appBar.switchView();
        this.dashboard.root.classList.toggle('view-hide');
        this.list.root.classList.toggle('view-hide');
    }

    clear() {
        this.appBar.menu.items.get(AppBarMenuItems.open.key).hidden = false;
        this.appBar.menu.items.get(AppBarMenuItems.save.key).hidden = true;

        this.dashboard.setVisible(false);
        this.list.clear();
        this.dashboard.map.update(Service.nominations);
        this.progress.root.hidden = true;
        this.progress.ctrl.buffer = 0;
        this.progress.ctrl.progress = 0;
    }

    show() {
        this.list.show(Service.nominations);
        this.dashboard.setVisible(true);
        this.dashboard.map.fit(Service.nominations);
        this.dashboard.refresh(Service.nominations);
        this.appBar.menu.items.get(AppBarMenuItems.open.key).hidden = true;
        this.appBar.menu.items.get(AppBarMenuItems.save.key).hidden = false;
        this.appBar.menu.items.get(AppBarMenuItems.upload.key).hidden = !Service.auth.signedIn;
        this.appBar.menu.items.get(AppBarMenuItems.import.key).hidden = false;
        this.progress.root.hidden = true;
    }

    update(nomination: Nomination) {
        this.list.update(nomination);
        this.dashboard.update(Service.nominations);
    }

    openFileUI(opened: (event: Event) => void) {
        const element = Eli.build('input', {
            cssText: 'display:none;',
            type: 'file', accept: 'json'
        });
        element.addEventListener('change', opened, false);
        document.body.append(element);
        element.click();
        setTimeout(() => {
            element.remove();
        }, 1000);
    }

    saveFileUI(filename: string, href: string) {
        const element = Eli.build('a', {
            cssText: 'display:none',
            href: href,
            download: filename,
        });
        document.body.append(element);
        element.click();
        element.remove();
    }
}

export default UIKit;
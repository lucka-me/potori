import i18next from 'i18next';

import AppBar, { AppBarMenuItems, AppBarActions } from './app-bar';
import Dark         from "./dark";
import Dialog       from './dialog';
import { eli } from "./eli";
import Progress     from './progress';
import { service, Nomination, StatusReason, StatusType } from "../service";
import Snackbar     from './snackbar';

import type Dashboard   from './dashboard';
import type ListView    from './list-view';

import '../css/extended.css';

class UIKit {

    appBar      = new AppBar();
    progress    = new Progress();
    dialog      = new Dialog();
    snackbar    = Snackbar;

    mainBox     : HTMLDivElement    = null;
    dashboard   : Dashboard         = null;
    list        : ListView          = null;

    dark        = new Dark();

    init() {
        document.documentElement.lang = i18next.language;

        const body = document.body;
        body.className = 'mdc-typography fullheight flex-box-col';

        // AppBar
        this.appBar.events.set(AppBarActions.view.key   , () => this.switchView());
        this.appBar.events.set(AppBarActions.signin.key , () => service.auth.signIn());
        this.appBar.menu.events.set(
            AppBarMenuItems.open.key, () => service.open()
        );
        this.appBar.menu.events.set(
            AppBarMenuItems.save.key, () => service.save()
        );
        this.appBar.menu.events.set(
            AppBarMenuItems.upload.key, () => service.upload()
        );
        this.appBar.menu.events.set(
            AppBarMenuItems.import.key, () => this.dialog.import.open()
        );
        this.appBar.menu.events.set(
            AppBarMenuItems.about.key, () => this.dialog.about.open()
        );
        this.appBar.menu.events.set(
            AppBarMenuItems.signout.key, () => service.auth.signOut()
        );
        this.appBar.init(body);

        // Progress
        this.progress.init(body);

        // MainBox
        this.mainBox = eli.build('div', {
            className: [
                'flex--1',
                'flex-box-row--wrap',
                'main-box'
            ].join(' '),
            cssText: [
                'min-height: 0%',
            ].join(';'),
        });
        body.append(this.mainBox);

        // Snackbar
        this.snackbar.init(body);

        // Dialog
        this.dialog.details.events.update = (nomination) => {
            this.update(nomination);
        };
        this.dialog.details.events.query = (bsId, succeed, failed) => {
            service.bs.query(bsId, succeed, failed);
        };
        this.dialog.details.map.events.queryLngLat = (bsId, succeed, failed) => {
            service.bs.queryLocation(bsId, succeed, failed);
        };
        this.dialog.import.import = (raw) => {
            service.importJSON(raw);
        };
        this.dialog.init(body);

        // Dark
        this.dark.init(body);
    }

    linkService() {
        // Service
        service.events.authStatusChanged = (signedIn) => this.authStatChanged(signedIn);
        if (!navigator.onLine) this.authStatChanged(false);
        service.events.progressUpdate = (percent) => {
            this.progress.progress = percent;
        }
        service.events.start = () => {
            this.preloadModules();
            this.progress.open();
        };
        service.events.idle = () => {
            this.show();
        };
        service.events.clear = () => {
            this.clear();
        };
        service.events.alert = (message) => {
            this.dialog.alert.open(message);
        }
        service.events.info = (message) => {
            this.snackbar.show(message);
        }
        // FileKit
        service.file.local.events.openUI = (opened) => {
            this.openFileUI(opened);
        }
        service.file.local.events.saveUI = (filename, href) => {
            this.saveFileUI(filename, href);
        }

        // Mari
        service.mari.events.buffer = (percent) => {
            this.progress.buffer = percent;
        };
        service.mari.events.progress = (percent) => {
            this.progress.progress = percent * 0.9;
        }
    }

    /**
     * Handle the Google Auth stat change event
     * Will hide sign in action if offline
     * @param signedIn Is signed in or not
     */
    private authStatChanged(signedIn: boolean) {
        if (signedIn) {
            this.appBar.actions.get(AppBarActions.signin.key).hidden = true;
            this.appBar.menu.items.get(AppBarMenuItems.signout.key).hidden = false;
        } else {
            this.clear();
            this.appBar.actions.get(AppBarActions.signin.key).hidden = !navigator.onLine;
            this.appBar.menu.items.get(AppBarMenuItems.signout.key).hidden = true;
            this.appBar.menu.items.get(AppBarMenuItems.upload.key).hidden = true;
            this.appBar.menu.items.get(AppBarMenuItems.import.key).hidden = true;
        }
    }

    switchView() {
        if (!this.dashboard) return;
        this.appBar.switchView();
        this.dashboard.root.classList.toggle('view-hide');
        this.list.root.classList.toggle('view-hide');
    }

    clear() {
        this.appBar.menu.items.get(AppBarMenuItems.open.key).hidden = false;
        this.appBar.menu.items.get(AppBarMenuItems.save.key).hidden = true;
        this.progress.close();
        this.progress.buffer = 0;
        this.progress.progress = 0;
        
        if(!this.dashboard) return;
        this.dashboard.setVisible(false);
        this.list.clear();
        this.dashboard.map.update(service.nominations);
    }

    show() {
        this.prepareViews().then(() => {
            this.dashboard.setVisible(true);
            this.dashboard.map.fit(service.nominations);
            this.dashboard.refresh(service.nominations);
            this.list.show(service.nominations);

            this.appBar.menu.items.get(AppBarMenuItems.open.key).hidden = true;
            this.appBar.menu.items.get(AppBarMenuItems.save.key).hidden = false;
            this.appBar.menu.items.get(AppBarMenuItems.upload.key).hidden = !service.auth.signedIn;
            this.appBar.menu.items.get(AppBarMenuItems.import.key).hidden = false;
            this.progress.close();
        });
    }

    /**
     * Start to preload modules
     */
    private preloadModules() {
        import(/* webpackChunkName: 'dashboard' */ './dashboard');
        import(/* webpackChunkName: 'listview' */  './list-view');
    }

    /**
     * Prepare the Dashboard and ListView
     * - First time: Load modules, build views and register events
     * - After: Return directly
     */
    private async prepareViews() {

        if (this.dashboard) return;

        // Lazyload Dashboard
        const Dashboard = await import(
            /* webpackChunkName: 'dashboard' */
            './dashboard'
        );
        this.dashboard = new Dashboard.default();
        this.dashboard.init(this.mainBox);
        service.events.updateBs = () => {
            this.dashboard.bs.update(service.nominations);
        }
        this.dashboard.map.events.styleLoaded = () => {
            return service.nominations;
        }
        this.dashboard.filter.events.switchType = (type, visible) => {
            if (type.key !== 'rejected' || !visible) {
                for (const nomination of service.nominations) {
                    if (service.status.typeMatched(nomination.status.code, type.code)) {
                        document.getElementById(`card-${nomination.id}`).hidden = !visible;
                    }
                }
            }
            if (type.key === 'rejected') {
                this.dashboard.map.reasonFilter = this.dashboard.filter.reasonFilter;
                this.dashboard.map.updateRejected(service.nominations);
            }
            this.dashboard.map.setTypeVisible(type.key, visible);
        };
        this.dashboard.filter.events.switchReason = (reason, visible) => {
            for (const nomination of service.nominations) {
                if (nomination.status.code !== reason.code) continue;
                document.getElementById(`card-${nomination.id}`).hidden = !visible;
            }
            this.dashboard.map.reasonFilter = this.dashboard.filter.reasonFilter;
            this.dashboard.map.updateRejected(service.nominations);
        };
        this.dashboard.bs.events.analyse = (nominations) => {
            return service.bs.analyse(nominations);
        }
        this.dashboard.bs.basic.events = {
            refresh: () => {
                service.updateBsData();
            },
            clear: () => {
                service.clearBsData();
                this.dashboard.bs.update([]);
            }
        }
        this.dark.change = () => {
            if (this.dashboard) this.dashboard.updateStyle();
            this.dialog.details.updateStyle();
        };

        // Lazyload ListView
        const ListView = await import(
            /* webpackChunkName: 'listview' */
            './list-view'
        );
        this.list = new ListView.default();
        this.list.init(this.mainBox);

        this.list.events.focus = (nomination) => {
            this.dashboard.map.easeTo(nomination.lngLat);
        }
        this.list.events.openDetails = (nomination) => {
            this.dialog.details.open(nomination);
        }
        this.dashboard.map.events.focus = (id) => {
            const top = this.list.root.offsetTop + 8;
            this.list.root.scrollTo(
                0, document.getElementById(`card-${id}`).offsetTop - top
            );
        }
    }

    update(nomination: Nomination) {
        if (!this.dashboard) return;
        this.dashboard.update(service.nominations);
        let visibility = false;
        if (nomination.status instanceof StatusReason) {
            visibility = this.dashboard.filter.reasons.get(nomination.status).checked;
        } else if (nomination.status instanceof StatusType) {
            visibility = this.dashboard.filter.types.get(nomination.status).checked;
        }
        this.list.update(nomination, visibility);
    }

    openFileUI(opened: (file: File) => void) {
        const element = eli.build('input', {
            cssText: 'display:none;',
            type: 'file', accept: 'json'
        });
        element.addEventListener('change', (event) => {
            opened((event.target as HTMLInputElement).files[0]);
        }, false);
        document.body.append(element);
        element.click();
        setTimeout(() => {
            element.remove();
        }, 1000);
    }

    saveFileUI(filename: string, href: string) {
        const element = eli.build('a', {
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
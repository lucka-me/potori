import i18next from 'i18next';
import { MDCRipple } from '@material/ripple';
import { MDCTopAppBar } from '@material/top-app-bar';

import { base } from 'ui/base';
import { eliAppBar } from 'eli/app-bar';
import { eliIcon } from 'eli/icon';
import { eliIconButton } from 'eli/icon-button';

import './style.scss';

import { AppBarActions, StringKey } from './constants';

import type AppBarMenu from './menu';
import { AppBarMenuItems } from './menu/constants';

type BasicCallback = () => void;
type AppBarActionEventsMap = Map<string, BasicCallback>;

interface AppBarEvents {
    action: AppBarActionEventsMap;  // Click events for actions
    backToTop: BasicCallback;
}

/**
 * App bar component
 */
class AppBar extends base.Prototype {

    private root: HTMLHeadElement = null;

    menu: AppBarMenu = null;    // Menu component

    actions: Map<string, HTMLButtonElement> = new Map();        // Actions
    events: AppBarEvents = {
        action: new Map(),
        backToTop: () => { },
    };

    constructor() {
        super();
        this.events.action.set(AppBarActions.menu.key, () => this.menu.open());
    }

    init(parent: HTMLElement) {
        super.init(parent);
        this.render();
    }

    render() {
        const actions = [];
        for (const value of Object.values(AppBarActions)) {
            const elementAction = eliIconButton(value.icon, i18next.t(value.title))
            actions.push(elementAction);
            const rippleAction = new MDCRipple(elementAction);
            rippleAction.unbounded = true;
            rippleAction.listen('click', this.events.action.get(value.key));
            elementAction.hidden = true;
            this.actions.set(value.key, elementAction);
        }
        this.actions.get(AppBarActions.view.key).classList.add('action-view');
        this.actions.get(AppBarActions.open.key).hidden = false;
        this.actions.get(AppBarActions.about.key).hidden = false;

        this.root = eliAppBar('Potori', actions);

        this.parent.append(this.root);
        this.parent.append(eliAppBar.fixedAdjust());
        const ctrl = new MDCTopAppBar(this.root)
        ctrl.listen('dblclick', () => {
            this.events.backToTop();
        });
    }

    async prepare() {
        if (this.menu) return;

        // Lazyload Menu
        const AppBarMenu = await import(
            /* webpackChunkName: 'ui-async' */
            './menu'
        );
        this.menu = new AppBarMenu.default();
        this.menu.init(this.root.querySelector('.mdc-top-app-bar__section--align-end'));

        this.actions.get(AppBarActions.menu.key).hidden = false;
        this.actions.get(AppBarActions.open.key).hidden = true;
        this.actions.get(AppBarActions.about.key).hidden = true;
    }

    /**
     * Switch the view action between Dashboard and List
     */
    switchView() {
        const actionView = this.actions.get(AppBarActions.view.key);
        const switchToList = actionView.innerHTML === eliIcon.Icon.thList;
        actionView.innerHTML = switchToList ? eliIcon.Icon.tachometerAlt : eliIcon.Icon.thList;
        actionView.title = i18next.t(switchToList ? StringKey.dashboard : StringKey.list);
    }
}

export default AppBar;
export { AppBarMenuItems, AppBarActions };
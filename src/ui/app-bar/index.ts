import i18next from 'i18next';
import { MDCRipple } from '@material/ripple';
import { MDCTopAppBar } from '@material/top-app-bar';

import { eliAppBar } from 'eli/app-bar';
import { eliIcon } from 'eli/icon';
import { eliIconButton } from 'eli/icon-button';
import UIPrototype from 'ui/base';

import './style.scss';

import { AppBarActions, StringKey } from './constants';

import type AppBarMenu from './menu';
import { AppBarMenuItems } from './menu/constants';

type AppBarActionClickCallback = () => void;

/**
 * App bar component
 */
class AppBar extends UIPrototype {

    private root: HTMLHeadElement = null;

    menu: AppBarMenu = null;    // Menu component

    actions: Map<string, HTMLButtonElement> = new Map();        // Actions
    events: Map<string, AppBarActionClickCallback> = new Map(); // Click events for actions

    // private sectionActions: HTMLElement = null;

    constructor() {
        super();
        this.events.set(AppBarActions.menu.key, () => this.menu.open());
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
            rippleAction.listen('click', this.events.get(value.key));
            elementAction.hidden = true;
            this.actions.set(value.key, elementAction);
        }
        this.actions.get(AppBarActions.view.key).hidden = false;
        this.actions.get(AppBarActions.view.key).id = 'button-appBar-view';
        this.actions.get(AppBarActions.open.key).hidden = false;
        this.actions.get(AppBarActions.about.key).hidden = false;

        this.root = eliAppBar('Potori', actions);

        this.parent.append(this.root);
        this.parent.append(eliAppBar.fixedAdjust());
        new MDCTopAppBar(this.root);
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
import i18next from "i18next";
import { MDCRipple } from "@material/ripple";
import { MDCTopAppBar } from "@material/top-app-bar";

import { eli } from "ui/eli";
import UIPrototype from 'ui/base';

import { AppBarActions } from "./constants";
import { AppBarMenuItems } from "./menu/constants";

import type AppBarMenu from "./menu";

import './style.scss';

type AppBarActionClickCallback = () => void;

/**
 * App bar component
 */
class AppBar extends UIPrototype {

    menu: AppBarMenu = null;    // Menu component

    actions: Map<string, HTMLButtonElement> = new Map();        // Actions
    events: Map<string, AppBarActionClickCallback> = new Map(); // Click events for actions

    private sectionActions: HTMLElement = null;

    constructor() {
        super();
        this.events.set(AppBarActions.menu.key, () => this.menu.open());
    }

    init(parent: HTMLElement) {
        super.init(parent);
        this.render();
    }

    render() {
        this.sectionActions = eli.build('section', {
            className: [
                'mdc-top-app-bar__section',
                'mdc-top-app-bar__section--align-end'
            ].join(' '),
        });
        for (const value of Object.values(AppBarActions)) {
            const elementAction = eli.build('button', {
                className: 'fa mdc-icon-button',
                title: i18next.t(value.title),
                innerHTML: value.icon,
            });
            this.sectionActions.append(elementAction);
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

        const elementAppBar = eli.build('header', {
            className: 'mdc-top-app-bar mdc-top-app-bar--fixed',
        }, [
            eli.build('div', {
                className: 'mdc-top-app-bar__row',
            }, [
                eli.build('section', {
                    className: [
                        'mdc-top-app-bar__section',
                        'mdc-top-app-bar__section--align-start'
                    ].join(' '),
                }, [
                    eli.build('span', {
                        className: 'mdc-top-app-bar__title',
                        innerHTML: 'Potori',
                    }),
                ]),
                this.sectionActions,
            ]),
        ]);

        this.parent.append(elementAppBar);
        this.parent.append(eli.build('div', {
            className: 'mdc-top-app-bar--fixed-adjust'
        }));
        new MDCTopAppBar(elementAppBar);
    }

    async prepare() {
        if (this.menu) return;

        // Lazyload Menu
        const AppBarMenu = await import(
            /* webpackChunkName: 'ui-async' */
            './menu'
        );
        this.menu = new AppBarMenu.default();
        this.menu.init(this.sectionActions);

        this.actions.get(AppBarActions.menu.key).hidden = false;
        this.actions.get(AppBarActions.open.key).hidden = true;
        this.actions.get(AppBarActions.about.key).hidden = true;
    }

    /**
     * Switch the view action between Dashboard and List
     */
    switchView() {
        const actionView = this.actions.get(AppBarActions.view.key);
        const switchToList = actionView.innerHTML === '\uf00b';
        actionView.innerHTML = switchToList ? '\uf3fd' : '\uf00b';
        actionView.title = i18next.t(switchToList ? 'Dashboard' : 'List');
    }
}

export default AppBar;
export { AppBarMenuItems, AppBarActions };
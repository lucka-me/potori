import { MDCRipple } from "@material/ripple";
import { MDCTopAppBar } from "@material/top-app-bar";

import { AppBarActions } from "./constants";
import AppBarMenu, { AppBarMenuItems } from "./menu";
import UIPrototype, { eli, i18next } from '../base';

type AppBarActionClickCallback = () => void;

/**
 * App bar component
 */
class AppBar extends UIPrototype {

    menu = new AppBarMenu();    // Menu component

    actions: Map<string, HTMLButtonElement> = new Map();        // Actions
    events: Map<string, AppBarActionClickCallback> = new Map(); // Click events for actions

    constructor() {
        super();
        this.events.set(AppBarActions.menu.key, () => this.menu.open());
    }

    init(parent: HTMLElement) {
        super.init(parent);
        this.render();
    }

    render() {
        const sectionActions = eli.build('section', {
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
            sectionActions.append(elementAction);
            const rippleAction = new MDCRipple(elementAction);
            rippleAction.unbounded = true;
            rippleAction.listen('click', this.events.get(value.key));
            elementAction.hidden = true;
            this.actions.set(value.key, elementAction);
        }
        this.menu.init(sectionActions);
        this.actions.get(AppBarActions.view.key).hidden = false;
        this.actions.get(AppBarActions.view.key).id = 'button-appBar-view';
        this.actions.get(AppBarActions.menu.key).hidden = false;

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
                sectionActions,
            ]),
        ]);

        this.parent.append(elementAppBar);
        this.parent.append(eli.build('div', {
            className: 'mdc-top-app-bar--fixed-adjust'
        }));
        new MDCTopAppBar(elementAppBar);
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
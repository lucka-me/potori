import { MDCMenu } from "@material/menu";
import { MDCRipple } from "@material/ripple";
import { MDCTopAppBar } from "@material/top-app-bar";

import UIKitPrototype, { i18next } from './base';

const AppBarMenuItems = {
    open     : { key: 'open'    , title: 'Open'       },
    save     : { key: 'save'    , title: 'Save'       },
    upload   : { key: 'upload'  , title: 'Upload'     },
    import   : { key: 'import'  , title: 'Import'     },
    about    : { key: 'about'   , title: 'About'      },
    signout  : { key: 'signout' , title: 'Sign Out'   },
};

class AppBarMenu extends UIKitPrototype {

    ctrl: MDCMenu = null;
    items: Map<string, HTMLLIElement> = new Map();
    events: Map<string, () => void> = new Map();

    init(parent: HTMLElement) {
        super.init(parent);
        this.render();
    }

    render() {
        const menuList = eli.build('ul', {
            className: 'mdc-list',
            role: 'menu',
            ariaOrientation: 'vertical',
        });
        for (const value of Object.values(AppBarMenuItems)) {
            const element = eli.build('li', {
                className: 'mdc-list-item',
                role: 'menuitem',
                dataset: { code : value.key },
                hidden: true,
            }, [
                eli.build('span', {
                    className: 'mdc-list-item__text',
                    innerHTML: i18next.t(value.title),
                }),
            ]);
            this.items.set(value.key, element);
            menuList.append(element);
        }
        this.items.get(AppBarMenuItems.about.key).hidden = false;

        const menuSurface = eli.build('div', {
            className: 'mdc-menu mdc-menu-surface',
        }, [ menuList ]);
        const menuAnchor = eli.build('div', {
            className: 'mdc-menu-surface--anchor',
        }, [ menuSurface ]);
        this.parent.append(menuAnchor);

        this.ctrl = new MDCMenu(menuSurface);
        this.ctrl.listen(
            'MDCMenu:selected',
            (event: CustomEvent) => {
                this.events.get(event.detail.item.dataset.code as string)();
            }
        );
    }

    open() {
        if (!this.ctrl.open) { this.ctrl.open = true; }
    }
}

const AppBarActions = {
    view:   { key: 'view'   , title: 'List'     , icon: '\uf00b' },
    signin: { key: 'signin' , title: 'Sign In'  , icon: '\uf2bd' },
    menu:   { key: 'menu'   , title: 'Menu'     , icon: '\uf142' },
};

class AppBar extends UIKitPrototype {

    menu = new AppBarMenu();
    actions: Map<string, HTMLButtonElement> = new Map();
    events: Map<string, () => void> = new Map();

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

    switchView() {
        const actionView = this.actions.get(AppBarActions.view.key);
        const switchToList = actionView.innerHTML === '\uf00b';
        actionView.innerHTML = switchToList ? '\uf3fd' : '\uf00b';
        actionView.title = i18next.t(switchToList ? 'Dashboard' : 'List');
    }
}

export default AppBar;
export { AppBarMenuItems, AppBarActions };
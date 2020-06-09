import { MDCMenu } from "@material/menu";
import { MDCRipple } from "@material/ripple";
import { MDCTopAppBar } from "@material/top-app-bar";

import UIKitPrototype from './UIKitPrototype';
import Eli from "./Eli";

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

    constructor() {
        super();
    }

    init(parent: HTMLElement) {
        const menuList = Eli.build('ul', {
            className: 'mdc-list',
            role: 'menu',
            ariaOrientation: 'vertical',
        });
        console.log(AppBarMenuItems);
        console.log(Object.keys(AppBarMenuItems));
        console.log(Object.values(AppBarMenuItems));
        console.log(Object.entries(AppBarMenuItems));
        for (const value of Object.values(AppBarMenuItems)) {
            console.log(value.key);
            const element = Eli.build('li', {
                className: 'mdc-list-item',
                role: 'menuitem',
                dataset: { code : value.key },
                hidden: true,
                children: [
                    Eli.build('span', {
                        className: 'mdc-list-item__text',
                        innerHTML: value.title,
                    }),
                ],
            }) as HTMLLIElement;
            this.items.set(value.key, element);
            menuList.appendChild(element);
        }
        this.items.get(AppBarMenuItems.about.key).hidden = false;

        const menuSurface = Eli.build('div', {
            className: 'mdc-menu mdc-menu-surface',
            children: [ menuList ],
        });
        const menuAnchor = Eli.build('div', {
            className: 'mdc-menu-surface--anchor',
            children: [ menuSurface ],
        });
        parent.appendChild(menuAnchor);

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
    view: { key: 'view'   , title: 'List'     , icon: 'view_list'         },
    signin: { key: 'signin' , title: 'Sign In'  , icon: 'account_circle'    },
    menu: { key: 'menu'   , title: 'Menu'     , icon: 'more_vert'         },
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
        const sectionActions = Eli.build('section', {
            className: 'mdc-top-app-bar__section mdc-top-app-bar__section--align-end',
        });
        for (const value of Object.values(AppBarActions)) {
            const elementAction = Eli.build('button', {
                className: 'mdc-icon-button material-icons',
                title: value.title,
                innerHTML: value.icon,
            }) as HTMLButtonElement;
            sectionActions.appendChild(elementAction);
            const ripple = new MDCRipple(elementAction);
            ripple.unbounded = true;
            ripple.listen('click', (this.events as any)[value.key]);
            elementAction.hidden = true;
            this.actions.set(value.key, elementAction);
        }
        this.menu.init(sectionActions);
        this.actions.get(AppBarActions.view.key).hidden = false;
        this.actions.get(AppBarActions.view.key).id = 'button-appBar-view';
        this.actions.get(AppBarActions.menu.key).hidden = false;

        const elementAppBar = Eli.build('header', {
            className: 'mdc-top-app-bar',
            children: [
                Eli.build('div', {
                    className: 'mdc-top-app-bar__row',
                    children: [
                        Eli.build('section', {
                            className: [
                                'mdc-top-app-bar__section',
                                'mdc-top-app-bar__section--align-start'
                            ].join(' '),
                            children: [
                                Eli.build('span', {
                                    className: 'mdc-top-app-bar__title',
                                    innerHTML: 'Potori',
                                }),
                            ],
                        }),
                        sectionActions,
                    ],
                }),
            ],
        });

        parent.appendChild(elementAppBar);
        parent.appendChild(Eli.build('div', { className: 'mdc-top-app-bar--fixed-adjust' }));
        new MDCTopAppBar(elementAppBar);
    }
}

export default AppBar;
export { AppBarMenuItems, AppBarActions };
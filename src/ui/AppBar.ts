import { menu, ripple, topAppBar } from "material-components-web";

import UIKitPrototype, { Eli, i18next } from './UIKitPrototype';

const AppBarMenuItems = {
    open     : { key: 'open'    , title: 'Open'       },
    save     : { key: 'save'    , title: 'Save'       },
    upload   : { key: 'upload'  , title: 'Upload'     },
    import   : { key: 'import'  , title: 'Import'     },
    about    : { key: 'about'   , title: 'About'      },
    signout  : { key: 'signout' , title: 'Sign Out'   },
};

class AppBarMenu extends UIKitPrototype {

    ctrl: menu.MDCMenu = null;
    items: Map<string, HTMLLIElement> = new Map();
    events: Map<string, () => void> = new Map();

    init(parent: HTMLElement) {
        super.init(parent);
        this.render();
    }

    render() {
        const menuList = Eli.build('ul', {
            className: 'mdc-list',
            role: 'menu',
            ariaOrientation: 'vertical',
        });
        for (const value of Object.values(AppBarMenuItems)) {
            const element = Eli.build('li', {
                className: 'mdc-list-item',
                role: 'menuitem',
                dataset: { code : value.key },
                hidden: true,
            }, [
                Eli.build('span', {
                    className: 'mdc-list-item__text',
                    innerHTML: i18next.t(value.title),
                }),
            ]);
            this.items.set(value.key, element);
            menuList.appendChild(element);
        }
        this.items.get(AppBarMenuItems.about.key).hidden = false;

        const menuSurface = Eli.build('div', {
            className: 'mdc-menu mdc-menu-surface',
        }, [ menuList ]);
        const menuAnchor = Eli.build('div', {
            className: 'mdc-menu-surface--anchor',
        }, [ menuSurface ]);
        this.parent.appendChild(menuAnchor);

        this.ctrl = new menu.MDCMenu(menuSurface);
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
        const sectionActions = Eli.build('section', {
            className: [
                'mdc-top-app-bar__section',
                'mdc-top-app-bar__section--align-end'
            ].join(' '),
        });
        for (const value of Object.values(AppBarActions)) {
            const elementAction = Eli.build('button', {
                className: 'fa mdc-icon-button',
                title: i18next.t(value.title),
                innerHTML: value.icon,
            });
            sectionActions.appendChild(elementAction);
            const rippleAction = new ripple.MDCRipple(elementAction);
            rippleAction.unbounded = true;
            rippleAction.listen('click', this.events.get(value.key));
            elementAction.hidden = true;
            this.actions.set(value.key, elementAction);
        }
        this.menu.init(sectionActions);
        this.actions.get(AppBarActions.view.key).hidden = false;
        this.actions.get(AppBarActions.view.key).id = 'button-appBar-view';
        this.actions.get(AppBarActions.menu.key).hidden = false;

        const elementAppBar = Eli.build('header', {
            className: 'mdc-top-app-bar',
        }, [
            Eli.build('div', {
                className: 'mdc-top-app-bar__row',
            }, [
                Eli.build('section', {
                    className: [
                        'mdc-top-app-bar__section',
                        'mdc-top-app-bar__section--align-start'
                    ].join(' '),
                }, [
                    Eli.build('span', {
                        className: 'mdc-top-app-bar__title',
                        innerHTML: 'Potori',
                    }),
                ]),
                sectionActions,
            ]),
        ]);

        this.parent.appendChild(elementAppBar);
        this.parent.appendChild(Eli.build('div', {
            className: 'mdc-top-app-bar--fixed-adjust'
        }));
        new topAppBar.MDCTopAppBar(elementAppBar);
    }

    switchView() {
        const actionView = this.actions.get(AppBarActions.view.key);
        const switchToList = actionView.innerHTML === 'view_list';
        actionView.innerHTML = switchToList ? '\uf3fd' : '\uf00b';
        actionView.title = i18next.t(switchToList ? 'Dashboard' : 'List');
    }
}

export default AppBar;
export { AppBarMenuItems, AppBarActions };
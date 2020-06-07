import { UIKitPrototype } from './protorypes.js';
import Eli from "./Eli.js";

class AppBarMenu extends UIKitPrototype {
    constructor() {
        super();
        this.ctrl = null;
        this.item = { };
        this.event = {
            openFile:   () => { },
            saveFile:   () => { },
            uploadFile: () => { },
            import:     () => { },
            about:      () => { },
            signout:    () => { },
        };
    }

    init(parent) {
        const menuList = Eli.build('ul', {
            className: 'mdc-list',
            role: 'menu',
            ariaOrientation: 'vertical',
        });
        for (const item of AppBarMenu.items) {
            this.item[item.key] = Eli.build('li', {
                className: 'mdc-list-item',
                role: 'menuitem',
                dataset: { code : item.key },
                hidden: true,
                children: [
                    Eli.build('span', {
                        className: 'mdc-list-item__text',
                        innerHTML: item.title,
                    }),
                ],
            });
            menuList.appendChild(this.item[item.key]);
        }
        this.item.about.hidden = false;

        const menuSurface = Eli.build('div', {
            className: 'mdc-menu mdc-menu-surface',
            children: [ menuList ],
        });
        const menuAnchor = Eli.build('div', {
            className: 'mdc-menu-surface--anchor',
            children: [ menuSurface ],
        });
        parent.appendChild(menuAnchor);

        this.ctrl = new mdc.menu.MDCMenu(menuSurface);
        this.ctrl.listen(
            'MDCMenu:selected',
            (event) => this.event[event.detail.item.dataset.code]()
        );
    }

    open() {
        if (!this.ctrl.open) { this.ctrl.open = true; }
    }

    static get items() {
        return [
            { key: 'openFile'   , title: 'Open'     },
            { key: 'saveFile'   , title: 'Save'     },
            { key: 'uploadFile' , title: 'Upload'   },
            { key: 'import'     , title: 'Import'   },
            { key: 'about'      , title: 'About'    },
            { key: 'signout'    , title: 'Sign Out' },
        ];
    }
}


class AppBar extends UIKitPrototype {

    constructor() {
        super();

        this.button = { };
        this.menu = new AppBarMenu();
        this.event = {
            view:   () => { },
            signin: () => { },
            menu:   () => this.menu.open(),
        };
    }

    init(parent) {
        const sectionActions = Eli.build('section', {
            className: 'mdc-top-app-bar__section mdc-top-app-bar__section--align-end',
        });
        for (const button of AppBar.buttons) {
            const elementAction = Eli.build('button', {
                className: 'mdc-icon-button material-icons',
                title: button.title,
                innerHTML: button.icon,
            });
            sectionActions.appendChild(elementAction);
            this.button[button.key] = new mdc.ripple.MDCRipple(elementAction);
            this.button[button.key].unbounded = true;
            this.button[button.key].listen('click', this.event[button.key]);
            elementAction.hidden = true;
        }
        this.menu.init(sectionActions);
        this.button.view.root_.hidden = false;
        this.button.view.root_.id = 'button-appBar-view';
        this.button.menu.root_.hidden = false;

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
        new mdc.topAppBar.MDCTopAppBar(elementAppBar);
    }

    static get buttons() {
        return [
            { key: 'view'   , title: 'List'     , icon: 'view_list'         },
            { key: 'signin' , title: 'Sign In'  , icon: 'account_circle'    },
            { key: 'menu'   , title: 'Menu'     , icon: 'more_vert'         },
        ];
    }
}

export default AppBar;
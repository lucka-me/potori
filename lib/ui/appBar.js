import { UIKitPrototype } from './protorypes.js';
import { Eli } from "./Eli.js";
import AboutDialog from './dialog/AboutDialog.js';
import ImportDialog from './dialog/ImportDialog.js';

class AppBarMenu extends UIKitPrototype {
    constructor() {
        super();
        this.ctrl = null;
        this.item = { };
        this.event = {
            openFile:   (_) => service.open(),
            saveFile:   (_) => service.save(),
            uploadFile: (_) => service.upload(),
            import:     (_) => ImportDialog.open(),
            about:      (_) => AboutDialog.open(),
            signout:    (_) => service.auth.signOut(),
        };
    }

    init(parent) {
        const menuList = Eli.build('ul', {
            className: 'mdc-list',
            role: 'menu',
            ariaOrientation: 'vertical',
        });

        for (const key of Object.keys(value.string.menu)) {
            this.item[key] = Eli.build('li', {
                className: 'mdc-list-item',
                role: 'menuitem',
                dataset: { code : key },
                hidden: true,
                children: [
                    Eli.build('span', {
                        className: 'mdc-list-item__text',
                        innerHTML: value.string.menu[key].title,
                    }),
                ],
            });
            menuList.appendChild(this.item[key]);
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
}


class AppBar extends UIKitPrototype {

    constructor() {
        super();
        this.button = { };
        this.menu = new AppBarMenu();
        this.event = {
            view:   (_) => ui.switchView(),
            signin: (_) => service.auth.signIn(),
            menu:   (_) => ui.appBar.menu.open(),
        };
    }

    init(parent) {
        const sectionActions = Eli.build('section', {
            className: 'mdc-top-app-bar__section mdc-top-app-bar__section--align-end',
        });
        for (const key of Object.keys(value.string.appBar)) {
            const elementAction = Eli.build('button', {
                className: 'mdc-icon-button material-icons',
                title: value.string.appBar[key].title,
                innerHTML: value.string.appBar[key].icon,
            });
            sectionActions.appendChild(elementAction);
            ui.appBar.button[key] = new mdc.ripple.MDCRipple(elementAction);
            ui.appBar.button[key].unbounded = true;
            ui.appBar.button[key].listen('click', this.event[key]);
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
}

export { AppBar };
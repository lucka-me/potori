ui.appBar = {
    button: { },
    menu: {
        ctrl: null,
        item: { },
        event: {
            openFile:   (_) => process.open(),
            saveFile:   (_) => process.save(),
            uploadFile: (_) => process.upload(),
            import:     (_) => dialog.import.open(),
            about:      (_) => dialog.about.open(),
            signout:    (_) => auth.signOut(),
        },
        init(appBarActionDiv) {

            const menuList = eliKit.build('ul', {
                className: 'mdc-list',
                role: 'menu',
                ariaOrientation: 'vertical',
            });

            for (const key of Object.keys(value.string.menu)) {
                this.item[key] = eliKit.build('li', {
                    className: 'mdc-list-item',
                    role: 'menuitem',
                    dataset: { code : key },
                    hidden: true,
                    children: [
                        eliKit.build('span', {
                            className: 'mdc-list-item__text',
                            innerHTML: value.string.menu[key].title,
                        }),
                    ],
                });
                menuList.appendChild(this.item[key]);
            }

            this.item.about.hidden = false;

            const menuSurface = eliKit.build('div', {
                className: 'mdc-menu mdc-menu-surface',
                children: [ menuList ],
            });
            const menuAnchor = eliKit.build('div', {
                className: 'mdc-menu-surface--anchor',
                children: [ menuSurface ],
            });
            appBarActionDiv.appendChild(menuAnchor);

            this.ctrl = new mdc.menu.MDCMenu(menuSurface);
            this.ctrl.listen(
                'MDCMenu:selected',
                (event) => this.event[event.detail.item.dataset.code]()
            );
        },
        open() {
            if (!this.ctrl.open) {
                this.ctrl.open = true;
            }
        },
    },
    event: {
        view:   (_) => ui.switchView(),
        signin: (_) => auth.signIn(),
        menu:   (_) => ui.appBar.menu.open(),
    },
    init: () => {
        const appBarActionDiv = document.querySelector('.mdc-top-app-bar__section--align-end');
        for (const key of Object.keys(value.string.appBar)) {
            const buttonElement = eliKit.build('button', {
                className: 'mdc-icon-button material-icons',
                title: value.string.appBar[key].title,
                innerHTML: value.string.appBar[key].icon,
            });
            appBarActionDiv.appendChild(buttonElement);
            ui.appBar.button[key] = new mdc.ripple.MDCRipple(buttonElement);
            ui.appBar.button[key].unbounded = true;
            ui.appBar.button[key].listen('click', ui.appBar.event[key]);
            buttonElement.hidden = true;
        }
        ui.appBar.menu.init(appBarActionDiv);
        ui.appBar.button.view.root_.hidden = false;
        ui.appBar.button.view.root_.id = 'button-appBar-view';
        ui.appBar.button.menu.root_.hidden = false;
    },
};
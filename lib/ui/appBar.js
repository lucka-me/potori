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
        init(parent) {

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
            parent.appendChild(menuAnchor);

            this.ctrl = new mdc.menu.MDCMenu(menuSurface);
            this.ctrl.listen(
                'MDCMenu:selected',
                (event) => this.event[event.detail.item.dataset.code]()
            );
        },
        open() {
            if (!this.ctrl.open) { this.ctrl.open = true; }
        },
    },
    event: {
        view:   (_) => ui.switchView(),
        signin: (_) => auth.signIn(),
        menu:   (_) => ui.appBar.menu.open(),
    },
    init(parent) {
        const sectionActions = eliKit.build('section', {
            className: 'mdc-top-app-bar__section mdc-top-app-bar__section--align-end',
        });
        for (const key of Object.keys(value.string.appBar)) {
            const elementAction = eliKit.build('button', {
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

        const elementAppBar = eliKit.build('header', {
            className: 'mdc-top-app-bar',
            children: [
                eliKit.build('div', {
                    className: 'mdc-top-app-bar__row',
                    children: [
                        eliKit.build('section', {
                            className: [
                                'mdc-top-app-bar__section',
                                'mdc-top-app-bar__section--align-start'
                            ].join(' '),
                            children: [
                                eliKit.build('span', {
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
        parent.appendChild(eliKit.build('div', { className: 'mdc-top-app-bar--fixed-adjust' }));
        new mdc.topAppBar.MDCTopAppBar(elementAppBar);
    },
};
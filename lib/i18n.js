const i18n = {
    language: {
        'en-US': { contents: [], name: 'English' },
        'zh-CN': { contents: [], name: '简体中文' },
    },
    menu: null,
    labelButton: null,
    init() {
        const parent = document.querySelector('.mdc-top-app-bar__section--align-end');

        this.labelButton = Eli.build('span', {
            className: 'mdc-button__label'
        });
        const elementButtonMenu = Eli.build('button', {
            className: 'mdc-button mdc-button--unelevated mdc-top-app-bar__action-item',
            children: [ this.labelButton ],
        });
        parent.appendChild(elementButtonMenu);
        const buttonMenu = new mdc.ripple.MDCRipple(elementButtonMenu);
        buttonMenu.listen("click", () => this.openMenu());

        const menuList = Eli.build('ul', {
            className: 'mdc-list',
            role: 'menu',
            ariaOrientation: 'vertical',
        });
        for (const key of Object.keys(this.language)) {
            this.language[key].contents = document.querySelectorAll(`:lang(${key})`);
            menuList.appendChild(Eli.build('li', {
                className: 'mdc-list-item',
                role: 'menuitem',
                dataset: { code : key },
                children: [
                    Eli.build('span', {
                        className: 'mdc-list-item__text',
                        innerHTML: this.language[key].name,
                    }),
                ],
            }));
        }

        const menuSurface = Eli.build('div', {
            className: 'mdc-menu mdc-menu-surface',
            children: [ menuList ],
        });
        const menuAnchor = Eli.build('div', {
            className: 'mdc-menu-surface--anchor',
            children: [ menuSurface ],
        });
        parent.appendChild(menuAnchor);
        this.menu = new mdc.menu.MDCMenu(menuSurface);
        this.menu.listen('MDCMenu:selected', (event) => {
            this.selected(event.detail.item.dataset.code);
        });
        let language = window.navigator.language;
        if (!this.language[language]) {
            language = 'en-US';
        }
        this.selected(language);
    },
    openMenu() {
        if (!this.menu.open) this.menu.open = true;
    },
    selected(code) {
        this.labelButton.innerHTML = this.language[code].name;
        for (const key of Object.keys(this.language)) {
            const hidden = key !== code;
            for (const content of this.language[key].contents) {
                content.hidden = hidden;
            } 
        }
    },
}
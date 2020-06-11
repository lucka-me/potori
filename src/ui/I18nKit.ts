import { MDCMenu } from "@material/menu";
import { MDCRipple } from "@material/ripple";

import Eli from "./Eli";

interface LanguagePack {
    name: string;
    contents: Array<HTMLElement>;
}

class I18nKit {

    languages: Map<string, LanguagePack> = new Map();
    menu: MDCMenu = null;
    labelButton: HTMLSpanElement = null;

    constructor() {
        this.languages.set('en-US', { name: 'English', contents: [] });
        this.languages.set('zh-CN', { name: '简体中文', contents: [] });
    }

    init() {
        const parent = document.querySelector('.mdc-top-app-bar__section--align-end');

        this.labelButton = Eli.build('span', {
            className: 'mdc-button__label'
        });
        const elementButtonMenu = Eli.build('button', {
            className: 'mdc-button mdc-button--unelevated mdc-top-app-bar__action-item',
        }, [ this.labelButton ]);
        parent.appendChild(elementButtonMenu);
        const buttonMenu = new MDCRipple(elementButtonMenu);
        buttonMenu.listen("click", () => this.openMenu());

        const menuList = Eli.build('ul', {
            className: 'mdc-list',
            role: 'menu',
            ariaOrientation: 'vertical',
        });
        for (const [key, value] of this.languages.entries()) {
            value.contents = Array.from(document.querySelectorAll(`:lang(${key})`));
            menuList.appendChild(Eli.build('li', {
                className: 'mdc-list-item',
                role: 'menuitem',
                dataset: { code : key },
            }, [
                Eli.build('span', {
                    className: 'mdc-list-item__text',
                    innerHTML: value.name,
                }),
            ]));
        }

        const menuSurface = Eli.build('div', {
            className: 'mdc-menu mdc-menu-surface',
        }, [ menuList ]);
        const menuAnchor = Eli.build('div', {
            className: 'mdc-menu-surface--anchor',
        }, [ menuSurface ]);
        parent.appendChild(menuAnchor);
        this.menu = new MDCMenu(menuSurface);
        this.menu.listen('MDCMenu:selected', (event: CustomEvent) => {
            this.selected(event.detail.item.dataset.code);
        });
        let language = window.navigator.language;
        if (!this.languages.has(language)) {
            language = 'en-US';
        }
        this.selected(language);
    }

    openMenu() {
        if (!this.menu.open) this.menu.open = true;
    }

    selected(code: string) {
        this.labelButton.innerHTML = this.languages.get(code).name;
        for (const [key, value] of this.languages.entries()) {
            const hidden = key !== code;
            for (const content of value.contents) {
                content.hidden = hidden;
            } 
        }
    }
}

export default new I18nKit();
import i18next from "i18next";
import { MDCMenu } from "@material/menu";

import { eli } from "ui/eli";
import UIPrototype from 'ui/base';

import { AppBarMenuItems } from "./constants";

import "./style.scss";

type MenuItemClickCallback = () => void;

/**
 * Menu component in app bar
 */
export default class AppBarMenu extends UIPrototype {

    ctrl: MDCMenu = null;                                   // MDC controller
    items: Map<string, HTMLLIElement> = new Map();          // Menu items
    events: Map<string, MenuItemClickCallback> = new Map(); // Click events for menu items

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

    /**
     * Open the menu
     */
    open() {
        if (!this.ctrl.open) { this.ctrl.open = true; }
    }
}

export { AppBarMenuItems };
import i18next from 'i18next';
import { MDCMenu } from '@material/menu';

import { eliMenu } from 'eli/menu';
import UIPrototype from 'ui/base';

import { AppBarMenuItems } from './constants';

type MenuItemClickCallback = () => void;

/**
 * Menu component in app bar
 */
export default class AppBarMenu extends UIPrototype {

    private ctrl: MDCMenu = null;                           // MDC controller
    items: Map<string, HTMLLIElement> = new Map();          // Menu items
    events: Map<string, MenuItemClickCallback> = new Map(); // Click events for menu items

    init(parent: HTMLElement) {
        super.init(parent);
        this.render();
    }

    render() {
        const element = eliMenu(Object.values(AppBarMenuItems).map((item) => {
            const elementItem = eliMenu.item(item.key, i18next.t(item.title));
            this.items.set(item.key, elementItem);
            return elementItem;
        }));
        this.items.get(AppBarMenuItems.about.key).hidden = false;
        this.parent.append(element);

        this.ctrl = new MDCMenu(element.querySelector('.mdc-menu'));
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
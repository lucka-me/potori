import { UIKitPrototype } from './prototype.js';

class DarkKit extends UIKitPrototype {
    constructor() {
        super();
        this.enabled = false;
    }

    init(_) {
        const darkMediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
        const changed = (mediaQueryList) => {
            ui.dark.enabled = mediaQueryList.matches;
            ui.dashboard.updateStyle();
            ui.dialog.details.updateStyle();
        };
        darkMediaQueryList.addListener(changed);
        changed(darkMediaQueryList);
    }
}

export { DarkKit };
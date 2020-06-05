import { UIKitPrototype } from './protorypes.js';

class Dark extends UIKitPrototype {
    constructor() {
        super();
        this.enabled = false;
    }

    init(_) {
        const darkMediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
        const changed = (mediaQueryList) => {
            this.enabled = mediaQueryList.matches;
            ui.dashboard.updateStyle();
            ui.dialog.details.updateStyle();
        };
        darkMediaQueryList.addListener(changed);
        changed(darkMediaQueryList);
    }
}

export { Dark };
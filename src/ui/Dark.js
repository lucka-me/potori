import { UIKitPrototype } from './protorypes.js';

class Dark extends UIKitPrototype {
    constructor() {
        super();
        this.enabled = false;
        this.changed = () => {};
    }

    init(_) {
        const darkMediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
        const changed = (mediaQueryList) => {
            this.enabled = mediaQueryList.matches;
            this.changed();
        };
        darkMediaQueryList.addListener(changed);
        changed(darkMediaQueryList);
    }
}

export default new Dark();
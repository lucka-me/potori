import UIKitPrototype from './UIKitPrototype';

class Dark extends UIKitPrototype {

    enabled: boolean;
    changed: (enabled: boolean) => void;

    constructor() {
        super();
        this.enabled = false;
        this.changed = () => {};
    }

    init(_: HTMLElement) {
        const darkMediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
        const changed = (event: MediaQueryListEvent) => {
            this.enabled = event.matches;
            this.changed(this.enabled);
        };
        darkMediaQueryList.addListener(changed);
        this.enabled = darkMediaQueryList.matches;
        this.changed(this.enabled);
    }
}

export default new Dark();
import UIPrototype from './base';

class Dark extends UIPrototype {

    enabled = false;
    changed: (enabled: boolean) => void = () => {};

    init(parent: HTMLElement) {
        super.init(parent);
        const darkMediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
        const changed = (event: MediaQueryListEvent) => {
            this.enabled = event.matches;
            this.changed(this.enabled);
        };
        darkMediaQueryList.addListener(changed);
        this.enabled = darkMediaQueryList.matches;
    }
}

export default Dark;
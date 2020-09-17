import UIPrototype from '../base';

type DarkModeChangeCallback = (enabled: boolean) => void;

/**
 * Handle the dark mode
 */
export default class Dark extends UIPrototype {

    private enabled = false;
    changed: DarkModeChangeCallback = () => {};

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
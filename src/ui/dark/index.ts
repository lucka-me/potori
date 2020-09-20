import UIPrototype from 'ui/base';

type DarkModeChangeCallback = (enabled: boolean) => void;

import './style.scss';

/**
 * Handle the dark mode
 */
export default class Dark extends UIPrototype {

    change: DarkModeChangeCallback = () => {};

    init(parent: HTMLElement) {
        super.init(parent);
        const darkMediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
        darkMediaQueryList.addListener((event: MediaQueryListEvent) => {
            this.change(event.matches);
        });
    }
}
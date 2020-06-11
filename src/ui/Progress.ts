import { linearProgress } from "material-components-web";

import UIKitPrototype from './UIKitPrototype';
import Eli from "./Eli";

class Progress extends UIKitPrototype {

    ctrl: linearProgress.MDCLinearProgress = null;
    root: HTMLDivElement = null;

    constructor() {
        super();
    }

    init(parent: HTMLElement) {
        this.root = Eli.build('div', {
            className: 'mdc-linear-progress',
            hidden: true
        }, [
            Eli.build('div', { className: 'mdc-linear-progress__buffering-dots' }),
            Eli.build('div', { className: 'mdc-linear-progress__buffer' }),
            Eli.build('div', { className: 'mdc-linear-progress__bar mdc-linear' }),
            Eli.build('div', {
                className: [
                    'mdc-linear-progress__bar',
                    'mdc-linear-progress__primary-bar',
                    'mdc-linear-progress-bar-color--secondary'
                ].join(' '),
            }, [
                Eli.build('span', { className: 'mdc-linear-progress__bar-inner' }),
            ]),
            Eli.build('div', {
                className: 'mdc-linear-progress__bar mdc-linear-progress__secondary-bar',
            }, [
                Eli.build('span', { className: 'mdc-linear-progress__bar-inner' }),
            ]),
        ]);
        parent.appendChild(this.root);
        this.ctrl = new linearProgress.MDCLinearProgress(this.root);
    }
}

export default Progress;
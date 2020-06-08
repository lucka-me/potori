import { UIKitPrototype } from './protorypes.js';
import Eli from "./Eli";

class Progress extends UIKitPrototype {
    constructor() {
        super();
        this.ctrl = null;
    }

    init(parent) {
        const element = Eli.build('div', {
            className: 'mdc-linear-progress',
            hidden: true,
            children: [
                Eli.build('div', { className: 'mdc-linear-progress__buffering-dots' }),
                Eli.build('div', { className: 'mdc-linear-progress__buffer' }),
                Eli.build('div', { className: 'mdc-linear-progress__bar mdc-linear' }),
                Eli.build('div', {
                    className: [
                        'mdc-linear-progress__bar',
                        'mdc-linear-progress__primary-bar',
                        'mdc-linear-progress-bar-color--secondary'
                    ].join(' '),
                    children: [
                        Eli.build('span', { className: 'mdc-linear-progress__bar-inner' }),
                    ],
                }),
                Eli.build('div', {
                    className: 'mdc-linear-progress__bar mdc-linear-progress__secondary-bar',
                    children: [
                        Eli.build('span', { className: 'mdc-linear-progress__bar-inner' }),
                    ],
                }),
            ],
        });
        parent.appendChild(element);
        this.ctrl = new mdc.linearProgress.MDCLinearProgress(element);
    }
}

export default Progress;
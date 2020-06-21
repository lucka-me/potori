import { MDCLinearProgress } from "@material/linear-progress";

import UIKitPrototype from './UIKitPrototype';
import Eli from "./Eli";

class Progress extends UIKitPrototype {

    ctrl: MDCLinearProgress = null;
    root: HTMLDivElement = null;

    init(parent: HTMLElement) {
        super.init(parent);
        this.render();
    }

    render() {
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
        this.parent.append(this.root);
        this.ctrl = new MDCLinearProgress(this.root);
    }
}

export default Progress;
import { MDCLinearProgress } from "@material/linear-progress";

import UIKitPrototype from './UIKitPrototype';
import Eli from "./Eli";

class Progress extends UIKitPrototype {

    ctrl: MDCLinearProgress = null;

    init(parent: HTMLElement) {
        super.init(parent);
        this.render();
    }

    render() {
        const element = Eli.build('div', {
            className: 'mdc-linear-progress mdc-linear-progress--closed',
        }, [
            Eli.build('div', { className: 'mdc-linear-progress__buffer' }, [
                Eli.build('div', { className: 'mdc-linear-progress__buffer-bar' }),
                Eli.build('div', { className: 'mdc-linear-progress__buffer-dots' }),
            ]),
            Eli.build('div', {
                className: 'mdc-linear-progress__bar mdc-linear-progress__primary-bar',
            }, [
                Eli.build('span', { className: 'mdc-linear-progress__bar-inner' }),
            ]),
            Eli.build('div', {
                className: 'mdc-linear-progress__bar mdc-linear-progress__secondary-bar',
            }, [
                Eli.build('span', { className: 'mdc-linear-progress__bar-inner' }),
            ]),
        ]);
        this.parent.append(element);
        this.ctrl = new MDCLinearProgress(element);
    }
}

export default Progress;
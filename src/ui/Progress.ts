import { MDCLinearProgress } from "@material/linear-progress";

import UIKitPrototype from './UIKitPrototype';
import Eli from "./Eli";

class Progress extends UIKitPrototype {

    private ctrl: MDCLinearProgress = null;
    private root: HTMLDivElement = null;

    init(parent: HTMLElement) {
        super.init(parent);
        this.render();
    }

    render() {
        this.root = Eli.build('div', {
            className: 'mdc-linear-progress mdc-linear-progress--closed',
            hidden: true
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
        this.parent.append(this.root);
        this.ctrl = new MDCLinearProgress(this.root);
    }

    /**
     * Display and open the progress bar
     */
    open() {
        this.root.hidden = false;
        this.ctrl.open();
    }

    /**
     * Hide and close the progress bar
     */
    close() {
        this.root.hidden = true;
        this.ctrl.close();
    }

    /**
     * Set buffer progress
     */
    set buffer(buffer: number) { this.ctrl.buffer = buffer; }

    /**
     * Set main progress
     */
    set progress(progress: number) { this.ctrl.progress = progress; }
}

export default Progress;
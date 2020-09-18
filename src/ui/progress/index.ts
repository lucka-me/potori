import { MDCLinearProgress } from "@material/linear-progress";

import UIPrototype, { eli } from '../base';

/**
 * Progress bar component
 */
class Progress extends UIPrototype {

    private ctrl: MDCLinearProgress = null; // MDC linear progress controller
    private root: HTMLDivElement = null;    // The progress bar element

    init(parent: HTMLElement) {
        super.init(parent);
        this.render();
    }

    render() {
        this.root = eli.build('div', {
            className: 'mdc-linear-progress mdc-linear-progress--closed',
            hidden: true
        }, [
            eli.build('div', { className: 'mdc-linear-progress__buffer' }, [
                eli.build('div', { className: 'mdc-linear-progress__buffer-bar' }),
                eli.build('div', { className: 'mdc-linear-progress__buffer-dots' }),
            ]),
            eli.build('div', {
                className: 'mdc-linear-progress__bar mdc-linear-progress__primary-bar',
            }, [
                eli.build('span', { className: 'mdc-linear-progress__bar-inner' }),
            ]),
            eli.build('div', {
                className: 'mdc-linear-progress__bar mdc-linear-progress__secondary-bar',
            }, [
                eli.build('span', { className: 'mdc-linear-progress__bar-inner' }),
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
     * Set buffer (secondary) progress
     */
    set buffer(buffer: number) { this.ctrl.buffer = buffer; }

    /**
     * Set main progress
     */
    set progress(progress: number) { this.ctrl.progress = progress; }
}

export default Progress;
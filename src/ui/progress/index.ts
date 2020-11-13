import { MDCLinearProgress } from '@material/linear-progress';

import { eliLinearProgress } from 'eli/linear-progress';
import UIPrototype from 'ui/base';

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
        this.root = eliLinearProgress();
        this.root.hidden = true;
        this.parent.append(this.root);
        this.ctrl = new MDCLinearProgress(this.root);
        this.ctrl.close();
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
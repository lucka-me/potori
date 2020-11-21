import { MDCSnackbar } from '@material/snackbar';

import { base } from 'ui/base';
import { eliSnackbar } from 'eli/snackbar';

/**
 * Snackbar component for showing information message
 */
export default class Snackbar extends base.Prototype {

    ctrl: MDCSnackbar = null;   // MDC snackbar controller

    render() {
        const element = eliSnackbar();
        this.parent.append(element);
        this.ctrl = new MDCSnackbar(element);
    }

    /**
     * Show snackbar with a message
     * @param message Message to display
     */
    show(message: string) {
        if (!this.ctrl) this.render();
        this.ctrl.labelText = message;
        this.ctrl.open();
    }
}
import { MDCSnackbar } from '@material/snackbar';

import { eliSnackbar } from 'eli/snackbar';
import UIPrototype from 'ui/base';

import './style.scss';

/**
 * Snackbar component for showing information message
 */
export default class Snackbar extends UIPrototype {

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
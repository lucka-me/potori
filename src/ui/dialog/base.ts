import type { MDCDialog } from '@material/dialog';

import UIPrototype from 'ui/base';

export namespace base {

    const StringKeyBase = 'ui.dialog';

    export const Action = {
        close: 'close'
    };
    
    export const StringKey = {
        close: `${StringKeyBase}.close`,
    };
    
    /**
     * Ptototype of MDC dialog components
     * 
     * Should check if the ctrl is null and call render() if it is in open()
     */
    export class DialogPrototype extends UIPrototype {
    
        ctrl: MDCDialog = null; // MDC dialog controller
    
        /**
         * Open the dialog
         */
        open() {
            if (!this.ctrl) this.render();
            this.ctrl.open();
        }
    }
}
import UIPrototype from '../base';

import AboutDialog      from './AboutDialog';
import AlertDialog      from './AlertDialog';
import DetailsDialog    from './DetailsDialog';
import ImportDialog     from './ImportDialog';

/**
 * Virtual component to host all dialogs
 */
class Dialog extends UIPrototype {

    about       = new AboutDialog;
    alert       = AlertDialog;
    details     = new DetailsDialog;
    import      = new ImportDialog;

    init(parent: HTMLElement) {
        super.init(parent);
        for (const value of Object.values(this)) {
            value.init(parent);
        }
    }
}

export default Dialog;
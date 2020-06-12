import UIKitPrototype from './UIKitPrototype';

import AboutDialog      from './dialog/AboutDialog';
import AlertDialog      from './dialog/AlertDialog';
import DetailsDialog    from './dialog/DetailsDialog';
import ImportDialog     from './dialog/ImportDialog';
import Snackbar         from './dialog/Snackbar';

class Dialog extends UIKitPrototype {

    about       = new AboutDialog;
    alert       = AlertDialog;
    details     = new DetailsDialog;
    import      = new ImportDialog;

    shackbar    = Snackbar;

    init(parent: HTMLElement) {
        super.init(parent);
        for (const value of Object.values(this)) {
            value.init(parent);
        }
    }
}

export default Dialog;
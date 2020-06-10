import UIKitPrototype from './UIKitPrototype';

import AboutDialog      from './dialog/AboutDialog';
import AlertDialog      from './dialog/AlertDialog';
import DetailsDialog    from './dialog/DetailsDialog';
import ImportDialog     from './dialog/ImportDialog';
import Snackbar         from './dialog/Snackbar';

class Dialog extends UIKitPrototype {
    constructor() {
        super();
        this.about      = new AboutDialog;
        this.alert      = AlertDialog;
        this.details    = new DetailsDialog;
        this.import     = new ImportDialog;

        this.shackbar   = Snackbar;
    }

    init(parent) {
        for (const key of Object.keys(this)) {
            this[key].init(parent);
        }
    }
}

export default Dialog;
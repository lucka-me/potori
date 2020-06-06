import { UIKitPrototype } from './protorypes.js';

import AboutDialog      from './dialog/AboutDialog.js';
import AlertDialog      from './dialog/AlertDialog.js';
import DetailsDialog    from './dialog/DetailsDialog.js';
import ImportDialog     from './dialog/ImportDialog.js';
import Snackbar         from './dialog/Snackbar.js';

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
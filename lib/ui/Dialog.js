import { UIKitPrototype } from './protorypes.js';

import AboutDialog      from './dialog/AboutDialog.js';
import AlertDialog      from './dialog/AlertDialog.js';
import DetailsDialog    from './dialog/DetailsDialog.js';
import ImportDialog     from './dialog/ImportDialog.js';

class Dialog extends UIKitPrototype {
    constructor() {
        super();
        this.about      = AboutDialog;
        this.alert      = AlertDialog;
        this.details    = DetailsDialog;
        this.import     = ImportDialog;
    }

    init(parent) {
        for (const key of Object.keys(this)) {
            this[key].init(parent);
        }
    }
}

 export { Dialog };
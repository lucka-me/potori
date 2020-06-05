import { UIKitPrototype } from './prototype.js';

import { AboutDialog    } from './dialog/about.js';
import { AlertDialog    } from './dialog/alert.js';
import { DetailsDialog  } from './dialog/details.js';
import { ImportDialog   } from './dialog/import.js';

class DialogKit extends UIKitPrototype {
    constructor() {
        super();
        this.about = new AboutDialog();
        this.alert = new AlertDialog();
        this.details    = new DetailsDialog();
        this.import     = new ImportDialog();
    }

    init(parent) {
        for (const key of Object.keys(this)) {
            this[key].init(parent);
        }
    }
}

 export { DialogKit };
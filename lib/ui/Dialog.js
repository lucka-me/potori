import { UIKitPrototype } from './Protorype.js';

import { AboutDialog    } from './dialog/About.js';
import { AlertDialog    } from './dialog/Alert.js';
import { DetailsDialog  } from './dialog/Details.js';
import { ImportDialog   } from './dialog/Import.js';

class Dialog extends UIKitPrototype {
    constructor() {
        super();
        this.about      = new AboutDialog();
        this.alert      = new AlertDialog();
        this.details    = new DetailsDialog();
        this.import     = new ImportDialog();
    }

    init(parent) {
        for (const key of Object.keys(this)) {
            this[key].init(parent);
        }
    }
}

 export { Dialog };
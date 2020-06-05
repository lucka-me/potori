import { AboutDialog    } from './about.js';
import { AlertDialog    } from './alert.js';
import { DetailsDialog  } from './details.js';
import { ImportDialog   } from './import.js';

window.dialog = {
    about:      new AboutDialog(),
    alert:      new AlertDialog(),
    details:    new DetailsDialog(),
    import:     new ImportDialog(),
};
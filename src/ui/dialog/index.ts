import UIPrototype from 'ui/base';

import AboutDialog      from './about';
import AlertDialog      from './alert';
import DetailsDialog    from './details';
import ImportDialog     from './import';

import './style.scss';

/**
 * Virtual component to host all dialogs
 */
class Dialog extends UIPrototype {

    about       = new AboutDialog();
    alert       = new AlertDialog();
    details     = new DetailsDialog();
    import      = new ImportDialog();

    init(parent: HTMLElement) {
        super.init(parent);
        for (const value of Object.values(this)) {
            value.init(parent);
        }
    }
}

export default Dialog;
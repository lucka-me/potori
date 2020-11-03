import UIPrototype from 'ui/base';

import AboutDialog      from './about';
import AlertDialog      from './alert';
import type DetailsDialog   from './details';
import type ImportDialog    from './import';
import type MatchDialog     from './match';

import './style.scss';

/**
 * Virtual component to host all dialogs
 */
class Dialog extends UIPrototype {

    about       = new AboutDialog();
    alert       = new AlertDialog();

    details:    DetailsDialog   = null;
    import:     ImportDialog    = null;
    match:      MatchDialog     = null;

    init(parent: HTMLElement) {
        super.init(parent);
        for (const value of Object.values(this)) {
            if (!value) continue;
            value.init(parent);
        }
    }

    async prepare() {
        if (this.details) return;

        // Lazyload DetailsDialog
        const DetailsDialog = await import(
            /* webpackChunkName: 'ui-async' */
            './details'
        );
        this.details = new DetailsDialog.default();
        this.details.init(this.parent);

        // Lazyload ImportDialog
        const ImportDialog = await import(
            /* webpackChunkName: 'ui-async' */
            './import'
        );
        this.import = new ImportDialog.default();
        this.import.init(this.parent);

        // Lazyload MatchDialog
        const MatchDialog = await import(
            /* webpackChunkName: 'ui-async' */
            './match'
        );
        this.match = new MatchDialog.default();
        this.match.init(this.parent);
    }
}

export default Dialog;
import i18next from 'i18next';
import { MDCDialog } from '@material/dialog';

import { eli } from 'ui/eli';
import { service } from 'service';
import DialogPrototype from 'ui/dialog/base';

import './style.scss';
import Nomination from 'service/nomination';

type CloseCallback = (matched: boolean) => void;

interface MatchDialogEvents {
    close: CloseCallback;
}

/**
 * Dialog to manually match nominations
 */
class MatchDialog extends DialogPrototype {

    events: MatchDialogEvents = {
        close: () => { },
    };

    render() {
        const element = DialogPrototype.buildDialog([
            eli.build('h2', {
                className: 'mdc-dialog__title',
                innerHTML: i18next.t('ui.dialog.match.title')
            }),
            // Contents
            eli.build('footer', {
                className: 'mdc-dialog__actions',
            }, [
                DialogPrototype.buildDialogAction('no', i18next.t('ui.dialog.match.no')),
                DialogPrototype.buildDialogAction('yes', i18next.t('ui.dialog.match.yes'))
            ]),
        ]);
        this.parent.append(element);
        this.ctrl = new MDCDialog(element);
        this.ctrl.listen('MDCDialog:closed', (event: CustomEvent) => {
            this.events.close(event.detail.action === 'yes');
        });
    }

    /**
     * Open the dialog
     */
    open(target: Nomination, candidate: Nomination) {
        if (!this.ctrl) this.render();
        // TODO: Set the elements
        this.ctrl.open();
    }
};

export default MatchDialog;
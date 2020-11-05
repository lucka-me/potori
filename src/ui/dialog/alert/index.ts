import i18next from 'i18next';
import { MDCDialog } from '@material/dialog';

import { eli } from 'ui/eli';
import { base } from 'ui/dialog/base';

import './style.scss';

/**
 * Dialog to show alert message
 */
export default class AlertDialog extends base.DialogPrototype {

    private textMessage: HTMLDivElement = null; // Dialog element

    render() {
        this.textMessage = eli.build('div', {
            className: base.ClassName.content,
        });
        const element = base.buildDialog('alert-dialog', [
            this.textMessage,
            eli.build('footer', { className: base.ClassName.actions }, [
                base.buildDialogAction(base.Action.close, i18next.t(base.StringKey.close))
            ]),
        ]);
        this.parent.append(element);
        this.ctrl = new MDCDialog(element);
    }

    /**
     * Set the alert message
     * @param message Alert message to display
     */
    set message(message: string) {
        if (!this.ctrl) this.render();
        this.textMessage.innerHTML = message;
    }
}
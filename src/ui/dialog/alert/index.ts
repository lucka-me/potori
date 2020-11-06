import i18next from 'i18next';
import { MDCDialog } from '@material/dialog';

import { eli } from 'eli/eli';
import { eliDialog } from 'eli/dialog';
import { base } from 'ui/dialog/base';

import './style.scss';

/**
 * Dialog to show alert message
 */
export default class AlertDialog extends base.DialogPrototype {

    private textMessage: HTMLSpanElement = null; // Dialog element

    render() {
        this.textMessage = eli('span', { });
        const element = eliDialog('alert-dialog', { 
            contents: [ this.textMessage, ],
            actions: [
                { action: base.Action.close, text: i18next.t(base.StringKey.close) }
            ]
        });
        
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
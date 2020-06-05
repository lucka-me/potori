import { DialogPrototype } from './prototypes.js';
import { Eli } from "../Eli.js";

class AlertDialog extends DialogPrototype {
    constructor() {
        super();
        this.textMessage = null;
    }

    init(parent) {
        this.textMessage = Eli.build('div', {
            className: 'mdc-dialog__content',
        });
        const element = Eli.dialog([
            this.textMessage,
            Eli.build('footer', {
                className: 'mdc-dialog__actions',
                children: [ Eli.dialogAction('close', 'Close') ],
            }),
        ]);
        parent.appendChild(element);
        this.ctrl = new mdc.dialog.MDCDialog(element);
    }

    open(message) {
        this.ctrl.open();
        this.textMessage.innerHTML = message;
    }
}

export default new AlertDialog();
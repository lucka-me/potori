import { DialogPrototype } from './prototype.js';

class AlertDialog extends DialogPrototype {
    constructor() {
        super();
        this.textMessage = null;
    }

    init(parent) {
        this.textMessage = eliKit.build('div', {
            className: 'mdc-dialog__content',
        });
        const element = eliKit.dialog([
            this.textMessage,
            eliKit.build('footer', {
                className: 'mdc-dialog__actions',
                children: [ eliKit.dialogAction('close', 'Close') ],
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

export { AlertDialog };
import DialogPrototype, { Eli, dialog } from './DialogPrototype';

class AlertDialog extends DialogPrototype {

    textMessage: HTMLDivElement = null;

    constructor() {
        super();
        this.textMessage = null;
    }

    init(parent: HTMLElement) {
        this.textMessage = Eli.build('div', {
            className: 'mdc-dialog__content',
        });
        const element = Eli.dialog([
            this.textMessage,
            Eli.build('footer', { className: 'mdc-dialog__actions' }, [
                Eli.dialogAction('close', 'Close')
            ]),
        ]);
        parent.appendChild(element);
        this.ctrl = new dialog.MDCDialog(element);
    }

    open(message: string) {
        this.ctrl.open();
        this.textMessage.innerHTML = message;
    }
}

export default new AlertDialog();
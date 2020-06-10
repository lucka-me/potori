import DialogPrototype, { Eli, MDCDialog } from './DialogPrototype';

class AlertDialog extends DialogPrototype {

    textMessage: HTMLDivElement = null;

    constructor() {
        super();
        this.textMessage = null;
    }

    init(parent: HTMLElement) {
        this.textMessage = Eli.build('div', {
            className: 'mdc-dialog__content',
        }) as HTMLDivElement;
        const element = Eli.dialog([
            this.textMessage,
            Eli.build('footer', {
                className: 'mdc-dialog__actions',
                children: [ Eli.dialogAction('close', 'Close') ],
            }),
        ]);
        parent.appendChild(element);
        this.ctrl = new MDCDialog(element);
    }

    open(message: string) {
        this.ctrl.open();
        this.textMessage.innerHTML = message;
    }
}

export default new AlertDialog();
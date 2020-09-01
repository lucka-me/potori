import DialogPrototype, { EliDialog as Eli, MDCDialog, i18next } from './prototype';

class AlertDialog extends DialogPrototype {

    textMessage: HTMLDivElement = null;

    render() {
        this.textMessage = Eli.build('div', {
            className: 'mdc-dialog__content',
        });
        const element = Eli.dialog([
            this.textMessage,
            Eli.build('footer', { className: 'mdc-dialog__actions' }, [
                Eli.dialogAction('close', i18next.t('Close'))
            ]),
        ]);
        this.parent.append(element);
        this.ctrl = new MDCDialog(element);
    }

    open(message: string) {
        if (!this.ctrl) this.render();
        this.ctrl.open();
        this.textMessage.innerHTML = message;
    }
}

export default new AlertDialog();
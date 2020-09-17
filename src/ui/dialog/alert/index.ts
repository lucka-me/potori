import DialogPrototype, { MDCDialog, i18next } from '../base';

/**
 * Dialog to show alert message
 */
class AlertDialog extends DialogPrototype {

    textMessage: HTMLDivElement = null; // Dialog element

    render() {
        this.textMessage = eli.build('div', {
            className: 'mdc-dialog__content',
        });
        const element = DialogPrototype.buildDialog([
            this.textMessage,
            eli.build('footer', { className: 'mdc-dialog__actions' }, [
                DialogPrototype.buildDialogAction('close', i18next.t('Close'))
            ]),
        ]);
        this.parent.append(element);
        this.ctrl = new MDCDialog(element);
    }

    /**
     * Open dialog and show alert message
     * @param message Alert message to display
     */
    open(message: string) {
        if (!this.ctrl) this.render();
        this.ctrl.open();
        this.textMessage.innerHTML = message;
    }
}

export default new AlertDialog();
import DialogPrototype from './DialogPrototype';
import Eli from "../Eli";

class Snackbar extends DialogPrototype {
    constructor() {
        super();
        this.textMessage = null;
    }

    init(parent) {
        this.textMessage = Eli.build('div', {
            className: 'mdc-snackbar__label',
            role: 'status', ariaLive: 'polite',
        });
        const elementActions = Eli.build('div', {
            className: 'mdc-snackbar__actions',
            children: [
                Eli.build('button', {
                    className: 'mdc-icon-button mdc-snackbar__dismiss material-icons',
                    title: 'Dismiss',
                    innerHTML: 'close',
                }),
            ],
        });
        const element = Eli.build('div', {
            className: 'mdc-snackbar',
            children: [
                Eli.build('div', {
                    className: 'mdc-snackbar__surface',
                    children: [
                        this.textMessage,
                        elementActions,
                    ],
                }),
            ],
        });
        parent.appendChild(element);
        this.ctrl = new mdc.snackbar.MDCSnackbar(element);
    }

    open(message) {
        this.textMessage.innerHTML = message;
        this.ctrl.open();
    }
}

export default new Snackbar();
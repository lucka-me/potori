import { MDCSnackbar } from "@material/snackbar";
import UIKitPrototype , { Eli } from '../UIKitPrototype';

class Snackbar extends UIKitPrototype {

    ctrl: MDCSnackbar = null;
    textMessage: HTMLDivElement = null;

    constructor() {
        super();
    }

    init(parent: HTMLElement) {
        this.textMessage = Eli.build('div', {
            className: 'mdc-snackbar__label',
            role: 'status', ariaLive: 'polite',
        });
        const elementActions = Eli.build('div', {
            className: 'mdc-snackbar__actions'
        }, [
            Eli.build('button', {
                className: 'mdc-icon-button mdc-snackbar__dismiss material-icons',
                title: 'Dismiss',
                innerHTML: 'close',
            }),
        ]);
        const element = Eli.build('div', { className: 'mdc-snackbar' }, [
            Eli.build('div', { className: 'mdc-snackbar__surface' }, [
                this.textMessage,
                elementActions,
            ]),
        ]);
        parent.appendChild(element);
        this.ctrl = new MDCSnackbar(element);
    }

    open(message: string) {
        this.textMessage.innerHTML = message;
        this.ctrl.open();
    }
}

export default new Snackbar();
import { snackbar } from "material-components-web";

import UIKitPrototype , { Eli, i18next } from '../UIKitPrototype';

class Snackbar extends UIKitPrototype {

    ctrl: snackbar.MDCSnackbar = null;
    textMessage: HTMLDivElement = null;

    render() {
        this.textMessage = Eli.build('div', {
            className: 'mdc-snackbar__label',
            role: 'status', ariaLive: 'polite',
        });
        const elementActions = Eli.build('div', {
            className: 'mdc-snackbar__actions'
        }, [
            Eli.build('button', {
                className: 'mdc-icon-button mdc-snackbar__dismiss material-icons',
                title: i18next.t('Dismiss'),
                innerHTML: 'close',
            }),
        ]);
        const element = Eli.build('div', { className: 'mdc-snackbar' }, [
            Eli.build('div', { className: 'mdc-snackbar__surface' }, [
                this.textMessage,
                elementActions,
            ]),
        ]);
        this.parent.appendChild(element);
        this.ctrl = new snackbar.MDCSnackbar(element);
    }

    open(message: string) {
        if (!this.ctrl) this.render();
        this.textMessage.innerHTML = message;
        this.ctrl.open();
    }
}

export default new Snackbar();
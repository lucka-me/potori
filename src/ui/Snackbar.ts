import { MDCSnackbar } from "@material/snackbar";

import UIKitPrototype , { Eli, i18next } from './UIKitPrototype';

class Snackbar extends UIKitPrototype {

    ctrl: MDCSnackbar = null;
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
                className: 'fa mdc-icon-button mdc-snackbar__dismiss',
                title: i18next.t('Dismiss'),
                innerHTML: '&#xf00d',
            }),
        ]);
        const element = Eli.build('div', { className: 'mdc-snackbar' }, [
            Eli.build('div', { className: 'mdc-snackbar__surface' }, [
                this.textMessage,
                elementActions,
            ]),
        ]);
        this.parent.append(element);
        this.ctrl = new MDCSnackbar(element);
    }

    show(message: string) {
        if (!this.ctrl) this.render();
        this.textMessage.innerHTML = message;
        this.ctrl.open();
    }
}

export default new Snackbar();
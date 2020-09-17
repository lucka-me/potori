import { MDCSnackbar } from "@material/snackbar";

import UIPrototype , { i18next } from './base';

class Snackbar extends UIPrototype {

    ctrl: MDCSnackbar = null;
    textMessage: HTMLDivElement = null;

    render() {
        this.textMessage = eli.build('div', {
            className: 'mdc-snackbar__label',
            role: 'status', ariaLive: 'polite',
        });
        const elementActions = eli.build('div', {
            className: 'mdc-snackbar__actions'
        }, [
            eli.build('button', {
                className: 'fa mdc-icon-button mdc-snackbar__dismiss',
                title: i18next.t('Dismiss'),
                innerHTML: '&#xf00d',
            }),
        ]);
        const element = eli.build('div', { className: 'mdc-snackbar' }, [
            eli.build('div', { className: 'mdc-snackbar__surface' }, [
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
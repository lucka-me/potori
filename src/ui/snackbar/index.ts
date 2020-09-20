import i18next from "i18next";
import { MDCSnackbar } from "@material/snackbar";

import { eli } from "ui/eli";
import UIPrototype from 'ui/base';

import './style.scss';

/**
 * Snackbar component for showing information message
 */
export default class Snackbar extends UIPrototype {

    ctrl: MDCSnackbar = null;   // MDC snackbar controller

    render() {
        const textMessage = eli.build('div', {
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
                textMessage,
                elementActions,
            ]),
        ]);
        this.parent.append(element);
        this.ctrl = new MDCSnackbar(element);
    }

    /**
     * Show snackbar with a message
     * @param message Message to display
     */
    show(message: string) {
        if (!this.ctrl) this.render();
        this.ctrl.labelText = message;
        this.ctrl.open();
    }
}
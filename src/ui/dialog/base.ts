import { MDCDialog } from '@material/dialog';

import { eli } from 'ui/eli';
import UIPrototype from 'ui/base';

/**
 * Ptototype of MDC dialog components
 * 
 * Should check if the ctrl is null and call render() if it is in open()
 */
export default class DialogPrototype extends UIPrototype {

    ctrl: MDCDialog = null; // MDC dialog controller

    /**
     * Build a MDC dialog element
     * @param contents Elements inside dialog
     * @returns The dialog element
     */
    static buildDialog(contents: Array<HTMLElement>): HTMLDivElement {
        return eli.build('div', {
            className: 'mdc-dialog',
            role: 'dialog',
            ariaModal: true,
        }, [
            eli.build('div', { className: 'mdc-dialog__container' }, [
                eli.build('div', { className: 'mdc-dialog__surface' }, contents),
            ]),
            eli.build('div', { className: 'mdc-dialog__scrim' }),
        ]);
    }

    /**
     * Build a MDC dialog action
     * @param action Identifier of the action
     * @param text Text on the action
     */
    static buildDialogAction(action: string, text: string): HTMLButtonElement {
        return eli.build('button', {
            className: 'mdc-button mdc-dialog__button',
            dataset: { mdcDialogAction: action, },
        }, [
            eli.build('span', {
                className: 'mdc-button__label', innerHTML: text
            }),
        ]);
    }

    /**
     * Build a hyperlink elementpm
     * @param href URL
     * @param title Text to show when mouse hovers
     * @param text Text to display in the link, will use `title` if not provided
     */
    static buildLink(href: string, title: string, text?: string): HTMLAnchorElement {
        return eli.build('a', {
            href: href,
            title: title,
            target: '_blank',
            rel: 'noopener',
            innerHTML: text || title,
        });
    }
}
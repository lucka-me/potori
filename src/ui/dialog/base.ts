import { MDCDialog } from '@material/dialog';

import { eli } from 'ui/eli';
import UIPrototype from 'ui/base';

export namespace base {
    export const Action = {
        close: 'close'
    };

    export const ClassName = {
        dialog: 'mdc-dialog',
        container: 'mdc-dialog__container',
        surface: 'mdc-dialog__surface',
        content: 'mdc-dialog__content',
        title: 'mdc-dialog__title',
        actions: 'mdc-dialog__actions',
        scrim: 'mdc-dialog__scrim',

        button: 'mdc-button mdc-dialog__button',
        buttonLabel: 'mdc-button__label',
    };
    
    export const StringKey = {
        close: 'ui.dialog.close'
    };
    
    /**
     * Ptototype of MDC dialog components
     * 
     * Should check if the ctrl is null and call render() if it is in open()
     */
    export class DialogPrototype extends UIPrototype {
    
        ctrl: MDCDialog = null; // MDC dialog controller
    
        /**
         * Open the dialog
         */
        open() {
            if (!this.ctrl) this.render();
            this.ctrl.open();
        }
    }

    /**
     * Build a MDC dialog element
     * @param contents Elements inside dialog
     * @returns The dialog element
     */
    export function buildDialog(
        name: string,
        contents: Array<HTMLElement>
    ): HTMLDivElement {
        return eli.build('div', {
            className: `${ClassName.dialog} ${name}`,
            role: 'dialog',
            ariaModal: true,
        }, [
            eli.build('div', { className: ClassName.container }, [
                eli.build('div', { className: ClassName.surface }, contents),
            ]),
            eli.build('div', { className: ClassName.scrim }),
        ]);
    }

    /**
     * Build a MDC dialog action
     * @param action Identifier of the action
     * @param text Text on the action
     */
    export function buildDialogAction(
        action: string,
        text: string
    ): HTMLButtonElement {
        return eli.build('button', {
            className: ClassName.button,
            dataset: { mdcDialogAction: action, },
        }, [
            eli.build('span', {
                className: ClassName.buttonLabel, innerHTML: text
            }),
        ]);
    }

    /**
     * Build a hyperlink elementpm
     * @param href URL
     * @param title Text to show when mouse hovers
     * @param text Text to display in the link, will use `title` if not provided
     */
    export function buildLink(
        href: string,
        title: string,
        text?: string
    ): HTMLAnchorElement {
        return eli.build('a', {
            href: href,
            title: title,
            target: '_blank',
            rel: 'noopener',
            innerHTML: text || title,
        });
    }
}
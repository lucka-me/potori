import { MDCDialog } from "@material/dialog";
import UIKitPrototype, { i18next } from "../base";

/**
 * Ptototype of MDC dialog components
 */
export default class DialogPrototype extends UIKitPrototype {
    ctrl: MDCDialog = null;

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
}

export { MDCDialog, i18next };
import { MDCDialog } from "@material/dialog";
import UIKitPrototype, { Eli, i18next } from "../UIKitPrototype";

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
        return Eli.build('div', {
            className: 'mdc-dialog mdc-dialog--scrollable',
            role: 'dialog',
            ariaModal: true,
        }, [
            Eli.build('div', { className: 'mdc-dialog__container' }, [
                Eli.build('div', { className: 'mdc-dialog__surface' }, contents),
            ]),
            Eli.build('div', { className: 'mdc-dialog__scrim' }),
        ]);
    }

    /**
     * Build a MDC dialog action
     * @param action Identifier of the action
     * @param text Text on the action
     */
    static buildDialogAction(action: string, text: string): HTMLButtonElement {
        return Eli.build('button', {
            className: 'mdc-button mdc-dialog__button',
            dataset: { mdcDialogAction: action, },
        }, [
            Eli.build('span', {
                className: 'mdc-button__label', innerHTML: text
            }),
        ]);
    }
}

export { Eli, MDCDialog, i18next };
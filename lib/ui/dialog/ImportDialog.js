import { DialogPrototype } from './prototypes.js';
import { Eli } from "../Eli.js";

class ImportDialog extends DialogPrototype {
    constructor() {
        super();
        this.textField = null;
    }

    init(parent) {
        const elementTextField = Eli.build('div', {
            className: 'mdc-text-field mdc-text-field--outlined mdc-text-field--textarea mdc-text-field--fullwidth',
            children: [
                Eli.build('textarea', {
                    className: 'mdc-text-field__input code',
                    id: 'input-dialog-import-wayfarer',
                    rows: 8, cols: 80
                }),
                Eli.build('div', {
                    className: 'mdc-notched-outline',
                    children: [
                        Eli.build('div', { className: 'mdc-notched-outline__leading' }),
                        Eli.build('div', {
                            className: 'mdc-notched-outline__notch',
                            children: [
                                Eli.build('label', {
                                    className: 'mdc-floating-label',
                                    for: 'input-dialog-import-wayfarer',
                                    innerHTML: 'JSON',
                                }),
                            ],
                        }),
                        Eli.build('div', { className: 'mdc-notched-outline__trailing' }),
                    ],
                }),
            ],
        });
        const contents = [
            elementTextField,
            Eli.build('div', {
                className: 'mdc-text-field-helper-line',
                children: [
                    Eli.build('div', {
                        className: 'mdc-text-field-helper-text mdc-text-field-helper-text--persistent',
                        children: [
                            Eli.text('From '),
                            Eli.link(
                                'https://wayfarer.nianticlabs.com/api/v1/vault/manage',
                                'Wayfarer API', 'Wayfarer API'
                            ),
                        ],
                    }),
                ],
            }),
        ];
        const elementDialog = Eli.dialog([
            Eli.build('h2', {
                className: 'mdc-dialog__title',
                innerHTML: 'Import'
            }),
            Eli.build('div', {
                className: 'mdc-dialog__content',
                children: contents,
            }),
            Eli.build('footer', {
                className: 'mdc-dialog__actions',
                children: [
                    Eli.dialogAction('close' , 'Close' ),
                    Eli.dialogAction('import', 'Import'),
                ],
            }),
        ]);
        parent.appendChild(elementDialog);
        this.ctrl = new mdc.dialog.MDCDialog(elementDialog);
        this.textField = new mdc.textField.MDCTextField(elementTextField);
        this.ctrl.listen('MDCDialog:closed', (event) => this.closed(event));
    }

    open() { this.ctrl.open(); }

    closed(event) {
        if (event.detail.action === 'import') {
            service.import(this.textField.value);
        }
    }
}

export default new ImportDialog();
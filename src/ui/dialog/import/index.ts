import { MDCTextField } from "@material/textfield";

import DialogPrototype, { MDCDialog, i18next } from '../base';

interface ImportDialogEvents {
    import: (raw: string) => void;
}

class ImportDialog extends DialogPrototype {

    textField: MDCTextField = null;

    events: ImportDialogEvents = {
        import: () => { },
    };

    render() {
        const elementTextField = eli.build('div', {
            className: [
                'mdc-text-field',
                'mdc-text-field--outlined',
                'mdc-text-field--textarea',
                'mdc-text-field--fullwidth'
            ].join(' '),
        }, [
            eli.build('textarea', {
                className: 'mdc-text-field__input code',
                id: 'input-dialog-import-wayfarer',
                rows: 8, cols: 80
            }),
            eli.build('div', {
                className: 'mdc-notched-outline',
            }, [
                eli.build('div', { className: 'mdc-notched-outline__leading' }),
                eli.build('div', {
                    className: 'mdc-notched-outline__notch',
                }, [
                    eli.build('label', {
                        className: 'mdc-floating-label',
                        for: 'input-dialog-import-wayfarer',
                        innerHTML: 'JSON',
                    }),
                ]),
                eli.build('div', { className: 'mdc-notched-outline__trailing' }),
            ]),
        ]);
        const elementDialog = DialogPrototype.buildDialog([
            eli.build('h2', {
                className: 'mdc-dialog__title',
                innerHTML: i18next.t('Import')
            }),
            eli.build('div', {
                className: 'mdc-dialog__content',
            }, [
                elementTextField,
                eli.build('div', {
                    className: 'mdc-text-field-helper-line',
                }, [
                    eli.build('div', {
                        className: 'mdc-text-field-helper-text mdc-text-field-helper-text--persistent',
                    }, [
                        i18next.t('From '),
                        DialogPrototype.buildLink(
                            'https://wayfarer.nianticlabs.com/api/v1/vault/manage',
                            i18next.t('Wayfarer API'), i18next.t('Wayfarer API')
                        ),
                    ]),
                ]),
            ]),
            eli.build('footer', {
                className: 'mdc-dialog__actions',
            }, [
                DialogPrototype.buildDialogAction('close' , i18next.t('Close' )),
                DialogPrototype.buildDialogAction('import', i18next.t('Import')),
            ]),
        ]);
        this.parent.append(elementDialog);
        this.ctrl = new MDCDialog(elementDialog);
        this.textField = new MDCTextField(elementTextField);
        this.ctrl.listen('MDCDialog:closed', (event: CustomEvent) => {
            this.closed(event);
        });
    }

    open() {
        if (!this.ctrl) this.render();
        this.ctrl.open();
    }

    closed(event: CustomEvent) {
        if (event.detail.action === 'import') {
            this.events.import(this.textField.value);
        }
    }
}

export default ImportDialog;
import i18next from 'i18next';
import { MDCDialog } from '@material/dialog';
import { MDCTextField } from '@material/textfield';

import { eli } from 'ui/eli';
import DialogPrototype from 'ui/dialog/base';

import './style.scss'

type ImportCallback = (raw: string) => void;

class ImportDialog extends DialogPrototype {

    private textField: MDCTextField = null; // MDC text field controller

    import: ImportCallback = () => { }; // Triggered when click Import button

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
                        innerHTML: i18next.t('ui.dialog.import.json'),
                    }),
                ]),
                eli.build('div', { className: 'mdc-notched-outline__trailing' }),
            ]),
        ]);
        const elementDialog = DialogPrototype.buildDialog([
            eli.build('h2', {
                className: 'mdc-dialog__title',
                innerHTML: i18next.t('ui.dialog.import.title')
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
                        i18next.t('ui.dialog.import.from'),
                        DialogPrototype.buildLink(
                            'https://wayfarer.nianticlabs.com/api/v1/vault/manage',
                            i18next.t('ui.dialog.import.wayfarer'), i18next.t('ui.dialog.import.wayfarer')
                        ),
                    ]),
                ]),
            ]),
            eli.build('footer', {
                className: 'mdc-dialog__actions',
            }, [
                DialogPrototype.buildDialogAction('close' , i18next.t('ui.dialog.close' )),
                DialogPrototype.buildDialogAction('import', i18next.t('ui.dialog.import.import')),
            ]),
        ]);
        this.parent.append(elementDialog);
        this.ctrl = new MDCDialog(elementDialog);
        this.textField = new MDCTextField(elementTextField);
        this.ctrl.listen('MDCDialog:closed', (event: CustomEvent) => {
            if (event.detail.action === 'import') {
                this.import(this.textField.value);
            }
        });
    }

    /**
     * Open dialog
     */
    open() {
        if (!this.ctrl) this.render();
        this.textField.value = '';
        this.ctrl.open();
    }
}

export default ImportDialog;
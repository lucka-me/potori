import i18next from 'i18next';
import { MDCDialog } from '@material/dialog';
import { MDCTextField } from '@material/textfield';

import { eli } from 'ui/eli';
import { base } from 'ui/dialog/base';

import './style.scss'

import { Action, ClassName, Link, StringKey } from './constants';

type ImportCallback = (raw: string) => void;

export default class ImportDialog extends base.DialogPrototype {

    private textField: MDCTextField = null; // MDC text field controller

    import: ImportCallback = () => { }; // Triggered when click Import button

    render() {
        const elementTextField = eli.build('div', {
            className: ClassName.textfield,
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
                        innerHTML: i18next.t(StringKey.json),
                    }),
                ]),
                eli.build('div', { className: 'mdc-notched-outline__trailing' }),
            ]),
        ]);
        const elementDialog = base.buildDialog('', [
            eli.build('h2', {
                className: base.ClassName.title,
                innerHTML: i18next.t(StringKey.title)
            }),
            eli.build('div', {
                className: base.ClassName.content,
            }, [
                elementTextField,
                eli.build('div', {
                    className: 'mdc-text-field-helper-line',
                }, [
                    eli.build('div', {
                        className: 'mdc-text-field-helper-text mdc-text-field-helper-text--persistent',
                    }, [
                        i18next.t(StringKey.from),
                        base.buildLink(
                            Link.wayfarer, i18next.t(StringKey.wayfarer),
                        ),
                    ]),
                ]),
            ]),
            eli.build('footer', {
                className: base.ClassName.actions,
            }, [
                base.buildDialogAction(base.Action.close , i18next.t(base.StringKey.close)),
                base.buildDialogAction(Action.import, i18next.t(StringKey.import)),
            ]),
        ]);
        this.parent.append(elementDialog);
        this.ctrl = new MDCDialog(elementDialog);
        this.textField = new MDCTextField(elementTextField);
        this.ctrl.listen('MDCDialog:closed', (event: CustomEvent) => {
            if (event.detail.action === Action.import) {
                this.import(this.textField.value);
            }
        });
    }

    /**
     * Open dialog
     */
    open() {
        super.open();
        this.textField.value = '';
    }
}
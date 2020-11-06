import i18next from 'i18next';
import { MDCDialog } from '@material/dialog';
import { MDCTextField } from '@material/textfield';

import { eliDialog } from 'eli/dialog';
import { eliTextField } from 'eli/text-field';
import { base } from 'ui/dialog/base';

import './style.scss'

import { Action, Link, StringKey } from './constants';

type ImportCallback = (raw: string) => void;

export default class ImportDialog extends base.DialogPrototype {

    private textField: MDCTextField = null; // MDC text field controller

    import: ImportCallback = () => { }; // Triggered when click Import button

    render() {
        const elementTextField = eliTextField({
            id: 'input-dialog-import-wayfarer',
            label: i18next.t(StringKey.json),
            textarea: true,
        });
        const elementDialog = eliDialog('import-dialog', {
            title: i18next.t(StringKey.title),
            contents: [
                elementTextField,
                eliTextField.helper([
                    i18next.t(StringKey.from),
                    eliDialog.link(i18next.t(StringKey.wayfarer), Link.wayfarer),
                ])
            ],
            actions: [
                { action: base.Action.close, text: i18next.t(base.StringKey.close) },
                { action: Action.import, text: i18next.t(StringKey.import) },
            ]
        });
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
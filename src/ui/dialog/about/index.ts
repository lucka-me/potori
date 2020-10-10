import i18next from 'i18next';
import { MDCDialog } from '@material/dialog';

import { eli } from 'ui/eli';
import { service } from 'service';
import DialogPrototype from 'ui/dialog/base';

import './style.scss';

/**
 * Dialog to show Potori information
 */
class AboutDialog extends DialogPrototype {

    render() {
        const element = DialogPrototype.buildDialog([
            eli.build('h2', {
                className: 'mdc-dialog__title',
                innerHTML: i18next.t('ui.dialog.about.title')
            }),
            eli.build('div', {
                className: 'mdc-dialog__content flex-box-col',
            }, [
                eli.build('span', {
                    className: 'mdc-typography--body2',
                }, [
                    DialogPrototype.buildLink('./docs', i18next.t('ui.dialog.about.documents'), i18next.t('ui.dialog.about.documents'))
                ]),
                eli.build('span', {
                    className: 'mdc-typography--body2',
                }, [
                    DialogPrototype.buildLink(
                        'https://github.com/lucka-me/potori',
                        i18next.t('ui.dialog.about.repo'), i18next.t('ui.dialog.about.repo')
                    ),
                ]),
                eli.build('span', {
                    className: 'mdc-typography--body2',
                }, [
                    DialogPrototype.buildLink(
                        'https://github.com/lucka-me/potori/blob/master/CHANGELOG.md',
                        i18next.t('ui.dialog.about.changelog'), service.version.string
                    ),
                ]),
            ]),
            eli.build('footer', {
                className: 'mdc-dialog__actions',
            }, [ DialogPrototype.buildDialogAction('close', i18next.t('ui.dialog.close')) ]),
        ]);
        this.parent.append(element);
        this.ctrl = new MDCDialog(element);
    }

    /**
     * Open the dialog
     */
    open() {
        if (!this.ctrl) this.render();
        this.ctrl.open();
    }
};

export default AboutDialog;
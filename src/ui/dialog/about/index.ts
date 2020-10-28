import i18next from 'i18next';
import { MDCDialog } from '@material/dialog';

import { eli } from 'ui/eli';
import { service } from 'service';
import DialogPrototype from 'ui/dialog/base';

import './style.scss';

type MessageCallback = (message: string) => void;

interface AboutDialogEvents {
    info: MessageCallback;
}

/**
 * Dialog to show Potori information
 */
class AboutDialog extends DialogPrototype {

    events: AboutDialogEvents = {
        info: () => { },
    };

    render() {
        const elementExportError = DialogPrototype.buildLink(
            '#', i18next.t('ui.dialog.about.exportError'),
        );
        elementExportError.onclick = () => {
            this.exportError();
            return false;
        }
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
                    DialogPrototype.buildLink(
                        './docs', i18next.t('ui.dialog.about.documents'),
                    )
                ]),
                eli.build('span', {
                    className: 'mdc-typography--body2',
                }, [
                    DialogPrototype.buildLink(
                        'https://github.com/lucka-me/potori',
                        i18next.t('ui.dialog.about.repo')
                    ),
                ]),
                eli.build('span', {
                    className: 'mdc-typography--body2',
                }, [
                    DialogPrototype.buildLink(
                        'https://github.com/lucka-me/potori/blob/master/CHANGELOG.md',
                        i18next.t('ui.dialog.about.changelog'),
                        service.version.string
                    ),
                ]),
                eli.build('span', {
                    className: 'mdc-typography--body2',
                }, [ elementExportError ]),
            ]),
            eli.build('footer', {
                className: 'mdc-dialog__actions',
            }, [
                DialogPrototype.buildDialogAction('close', i18next.t('ui.dialog.close'))
            ]),
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

    /**
     * Export error message to clipboard
     */
    private exportError() {
        if (service.errors.length < 1) {
            this.events.info(i18next.t('message:ui.dialog.about.exportErrorEmpty'));
            return;
        }
        let message = '';
        for (const error of service.errors) {
            let details = error.message;
            if ('message' in error.error) {
                const typedError = error.error as Error;
                details = typedError.stack || typedError.message;
            }
            message += `[${error.filename}][${error.lineno}:${error.colno}]${details}\n`;
        }
        const textarea = eli.build('textarea', {
            value: message, readOnly: true
        });
        document.body.append(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
        this.events.info(i18next.t('message:ui.dialog.about.exportErrorCopied', {
            count: service.errors.length
        }));
    }
};

export default AboutDialog;
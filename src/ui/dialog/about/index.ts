import i18next from 'i18next';
import { MDCDialog } from '@material/dialog';

import { eli } from '@lucka-labs/eli';
import { eliDialog } from 'eli/dialog';
import { eliUtil } from 'eli/util';
import { service } from 'service';
import { base } from 'ui/dialog/base';

import './style.scss';

import { Link, StringKey } from './constants';

type MessageCallback = (message: string) => void;

interface AboutDialogEvents {
    info: MessageCallback;
}

/**
 * Dialog to show Potori information
 */
export default class AboutDialog extends base.DialogPrototype {

    events: AboutDialogEvents = {
        info: () => { },
    };

    render() {
        const elementExportError = eliDialog.link(
            i18next.t(StringKey.exportError), '#'
        );
        elementExportError.onclick = () => {
            this.exportError();
            return false;
        }
        const element = eliDialog('about-dialog', {
            title: i18next.t(StringKey.title),
            contents: [
                eli('span', { }, [
                    eliDialog.link(i18next.t(StringKey.documents), Link.documents)
                ]),
                eli('span', { }, [
                    eliDialog.link(i18next.t(StringKey.repo), Link.repo),
                ]),
                eli('span', { }, [
                    eliDialog.link(
                        service.version.string,
                        Link.changelog,
                        i18next.t(StringKey.changelog)
                    ),
                ]),
                eli('span', { }, [ elementExportError ]),
            ],
            actions: [
                { action: base.Action.close, text: i18next.t(base.StringKey.close) }
            ]
        });
        this.parent.append(element);
        this.ctrl = new MDCDialog(element);
    }

    /**
     * Export error message to clipboard
     */
    private exportError() {
        if (service.errors.length < 1) {
            this.events.info(i18next.t(StringKey.messageExportErrorEmpty));
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
        eliUtil.copy(message);
        this.events.info(i18next.t(StringKey.messageExportErrorCopied, {
            count: service.errors.length
        }));
    }
};
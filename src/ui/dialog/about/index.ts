import i18next from 'i18next';
import { MDCDialog } from '@material/dialog';

import { eli } from 'eli/eli';
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
        const elementExportError = base.buildLink(
            '#', i18next.t(StringKey.exportError),
        );
        elementExportError.onclick = () => {
            this.exportError();
            return false;
        }
        const element = base.buildDialog('about-dialog', [
            eli('h2', {
                className: base.ClassName.title,
                innerHTML: i18next.t(StringKey.title)
            }),
            eli('div', {
                className: base.ClassName.content,
            }, [
                eli('span', { }, [
                    base.buildLink(
                        Link.documents, i18next.t(StringKey.documents),
                    )
                ]),
                eli('span', { }, [
                    base.buildLink(
                        Link.repo, i18next.t(StringKey.repo)
                    ),
                ]),
                eli('span', { }, [
                    base.buildLink(
                        Link.changelog,
                        i18next.t(StringKey.changelog),
                        service.version.string
                    ),
                ]),
                eli('span', { }, [ elementExportError ]),
            ]),
            eli('footer', {
                className: base.ClassName.actions,
            }, [
                base.buildDialogAction(
                    base.Action.close, i18next.t(base.StringKey.close)
                )
            ]),
        ]);
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
        eli.copy(message);
        this.events.info(i18next.t(StringKey.messageExportErrorCopied, {
            count: service.errors.length
        }));
    }
};
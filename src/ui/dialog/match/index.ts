import i18next from 'i18next';
import { MDCDialog } from '@material/dialog';

import { eli } from 'ui/eli';
import { service } from 'service';
import DialogPrototype from 'ui/dialog/base';

import './style.scss';
import Nomination from 'service/nomination';

type CloseCallback = (matched: boolean) => void;

interface MatchDialogEvents {
    close: CloseCallback;
}

/**
 * Dialog to manually match nominations
 */
class MatchDialog extends DialogPrototype {

    private content: HTMLDivElement = null;

    events: MatchDialogEvents = {
        close: () => { },
    };

    render() {
        this.content = eli.build('div', {
            className: 'mdc-dialog__content flex-box-col',
        });
        const element = DialogPrototype.buildDialog([
            eli.build('h2', {
                className: 'mdc-dialog__title',
                innerHTML: i18next.t('ui.dialog.match.title')
            }),
            this.content,
            eli.build('footer', {
                className: 'mdc-dialog__actions',
            }, [
                DialogPrototype.buildDialogAction('no', i18next.t('ui.dialog.match.no')),
                DialogPrototype.buildDialogAction('yes', i18next.t('ui.dialog.match.yes'))
            ]),
        ]);
        this.parent.append(element);
        this.ctrl = new MDCDialog(element);
        this.ctrl.listen('MDCDialog:closed', (event: CustomEvent) => {
            this.events.close(event.detail.action === 'yes');
        });
    }

    /**
     * Open the dialog
     */
    open(target: Nomination, candidate: Nomination) {
        if (!this.ctrl) this.render();

        this.content.innerHTML = '';
        this.content.append(i18next.t('ui.dialog.match.desc'));
        this.buildBlock(target);
        this.buildBlock(candidate);

        this.ctrl.open();
    }

    private buildBlock(nomination: Nomination) {
        const classNameInfo = [
            'margin-r--8',
            'flex-box-row--nowrap',
            'flex-align-items--center',
        ].join(' ');
        const info = [];
        info.push(eli.build('span', {
            className: classNameInfo,
        }, [
            eli.icon('&#xf062'),
            eli.build('span', {
                className: 'margin-l--4',
                innerHTML: nomination.confirmedTime > 0 ? nomination.confirmedDateString : i18next.t('ui.dialog.match.missing'),
            }),
        ]));
        if (nomination.status.code > 0) {
            const type = service.status.getTypeByCode(nomination.status.code);
            info.push(eli.build('span', {
                className: classNameInfo,
            }, [
                eli.icon(service.status.types.get(type).icon),
                eli.build('span', {
                    className: 'margin-l--4',
                    innerHTML: nomination.resultDateString
                }),
            ]));
            info.push(eli.build('span', {
                className: `${classNameInfo} status-${type}`,
            }, [
                eli.icon(nomination.status.icon),
                eli.build('span', {
                    className: 'margin-l--4',
                    innerHTML: i18next.t(nomination.status.title)
                }),
            ]));
        }
        const cssTextImg = [
            'object-fit: cover',
            'object-position: center',
            'width: 120px',
            'min-width: 120px',
            'height: 120px',
            'min-height: 120px',
        ].join(';');
        const element = eli.build('div', {
            className: 'margin-v--8 flex-box-row--nowrap'
        }, [
            eli.build('img', {
                cssText: cssTextImg,
                src: nomination.imageUrl.length > 0 ? nomination.imageUrl : 'https://wayfarer.nianticlabs.com/img/missing_image.png'
            }),
            eli.build('div', {
                className: [
                    'padding--8',
                    'flex-box--col',
                    'flex-align-items--start',
                    'flex-justify-content--start'
                ].join(' '),
            }, [
                eli.build('span', {
                    className: 'mdc-typography--headline6',
                    innerHTML: nomination.title,
                }),
                eli.build('div', {
                    className: 'mdc-typography--body2 flex-box-row--wrap',
                }, info),
            ]),
        ]);
        this.content.append(element);
    }
};

export default MatchDialog;
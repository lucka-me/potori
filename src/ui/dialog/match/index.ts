import i18next from 'i18next';
import { eli } from '@lucka-labs/eli';
import { MDCDialog } from '@material/dialog';

import { base } from 'ui/dialog/base';
import { eliDialog } from 'eli/dialog';
import { eliIcon } from 'eli/icon';
import { umi } from 'service/umi';
import Nomination from 'service/nomination';

import { Action, Link, StringKey } from './constants';

import './style.scss';

type CloseCallback = (matched: boolean) => void;

interface MatchDialogEvents {
    close: CloseCallback;
}

/**
 * Dialog to manually match nominations
 */
class MatchDialog extends base.DialogPrototype {

    private content: HTMLDivElement = null;

    events: MatchDialogEvents = {
        close: () => { },
    };

    render() {
        const element = eliDialog('match-dialog',  {
            title: i18next.t(StringKey.title),
            contents: [],
            actions: [
                { action: Action.no,    text: i18next.t(StringKey.no)   },
                { action: Action.yes,   text: i18next.t(StringKey.yes)  }
            ]
        });
        this.parent.append(element);
        this.content = element.querySelector('.mdc-dialog__content');
        this.ctrl = new MDCDialog(element);
        this.ctrl.listen('MDCDialog:closed', (event: CustomEvent) => {
            this.events.close(event.detail.action === Action.yes);
        });
    }

    set nominations(list: Array<Nomination>) {
        if (!this.ctrl) this.render();
        this.content.innerHTML = '';
        this.content.append(i18next.t(StringKey.desc));
        for (const nomination of list) {
            this.buildBlock(nomination);
        }
    }

    private buildBlock(nomination: Nomination) {
        const details = [
            this.buildDetail(eliIcon.Icon.arrowUp, nomination.confirmedDateString)
        ];
        if (nomination.status !== umi.StatusCode.Pending) {
            details.push(this.buildDetail(
                nomination.statusData.icon, nomination.resultDateString
            ));
            if (nomination.status === umi.StatusCode.Rejected) {
                for (const reason of nomination.reasonsData) {
                    const elementResult = this.buildDetail(
                        reason.icon, i18next.t(reason.title)
                    );
                    elementResult.classList.add(`status-rejected`);
                    details.push(elementResult);
                }
            }
        }
        const element = eli('div', {
            className: 'nomination-block'
        }, [
            eli('img', {
                src: nomination.image.length > 0 ? nomination.imageUrl : Link.missing
            }),
            eli('div', {  }, [
                eli('span', { innerHTML: nomination.title }),
                eli('div', { }, details),
            ]),
        ]);
        this.content.append(element);
    }

    /**
     * Build a detail block
     * @param icon Icon of the detail
     * @param text Text to display
     */
    private buildDetail(icon: string, text: string): HTMLSpanElement {
        return eli('span', { }, [
            eliIcon(icon),
            eli('span', { innerHTML: text }),
        ]);
    }
};

export default MatchDialog;
import i18next from 'i18next';
import { MDCDialog } from '@material/dialog';

import { eli } from 'eli/eli';
import { eliIcon } from 'eli/icon';
import { service } from 'service';
import Nomination from 'service/nomination';
import { base } from 'ui/dialog/base';

import './style.scss';

import { Action, Link, StringKey } from './constants';
import { eliDialog } from 'eli/dialog';

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
        if (nomination.status.code > 0) {
            const type = nomination.status.type;
            details.push(this.buildDetail(
                service.status.types.get(type).icon, nomination.resultDateString
            ));
            const elementResult = this.buildDetail(
                nomination.status.icon, i18next.t(nomination.status.title)
            );
            elementResult.classList.add(`status-${type}`);
            details.push(elementResult);
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
import i18next from 'i18next';
import { MDCDialog } from '@material/dialog';

import { eli } from 'ui/eli';
import { service } from 'service';
import Nomination from 'service/nomination';
import { base } from 'ui/dialog/base';

import './style.scss';

import { Action, Icon, Link, StringKey } from './constants';

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
        this.content = eli.build('div', {
            className: base.ClassName.content,
        });
        const element = base.buildDialog('match-dialog', [
            eli.build('h2', {
                className: base.ClassName.title,
                innerHTML: i18next.t(StringKey.title)
            }),
            this.content,
            eli.build('footer', {
                className: base.ClassName.actions,
            }, [
                base.buildDialogAction(Action.no, i18next.t(StringKey.no)),
                base.buildDialogAction(Action.yes, i18next.t(StringKey.yes))
            ]),
        ]);
        this.parent.append(element);
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
        const details = [];
        this.buildDetail(Icon.arrowUp, nomination.confirmedDateString);
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
        const element = eli.build('div', {
            className: 'nomination-block'
        }, [
            eli.build('img', {
                src: nomination.image.length > 0 ? nomination.imageUrl : Link.missing
            }),
            eli.build('div', {  }, [
                eli.build('span', { innerHTML: nomination.title }),
                eli.build('div', { }, details),
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
        return eli.build('span', { }, [
            eli.icon(icon),
            eli.build('span', { innerHTML: text }),
        ]);
    }
};

export default MatchDialog;
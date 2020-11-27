import i18next from 'i18next';

import { base } from 'ui/base';
import { eli } from 'eli/eli';
import { eliUtil } from 'eli/util';
import { service } from 'service';
import Nomination from 'service/nomination';

import './style.scss';

import NominationCard, { NominationCardEvents } from './card';
import { StringKey } from './constants';

interface NominationListEvents {
    alert: (message: string) => void;
    focus: (nomination: Nomination) => void;
    openDetails: (nomination: Nomination) => void;
}

export default class NominationList extends base.Prototype {

    private root: HTMLDivElement = null;
    private now = Date.now();

    events: NominationListEvents = {
        alert:          () => { },
        focus:          () => { },
        openDetails:    () => { },
    };

    init(parent: HTMLElement) {
        super.init(parent);
        this.render();
    }

    render() {
        this.root = eli('div', { className: 'list-view view-hide' });
        this.parent.append(this.root);
    }

    clear() {
        this.root.innerHTML = '';
    }

    show(nominations: Array<Nomination>) {
        this.clear();
        const cards = nominations.map((nomination) => {
            const c = NominationCard.build(nomination);
            NominationCard.update(c, nomination, this.now, this.createCardEvents(nomination));
            return c;
        });
        this.root.append(...cards);
    }

    update(nomination: Nomination, visibility: boolean) {
        const card = this.root.querySelector(`#card-${nomination.id}`) as HTMLDivElement;
        NominationCard.update(card, nomination, this.now, this.createCardEvents(nomination));
        card.hidden = !visibility;
    }

    focus(id: string) {
        const top = this.root.offsetTop + 8;
        const card = this.root.querySelector(`#card-${id}`) as HTMLDivElement;
        this.root.scrollTo(0, card.offsetTop - top);
    }

    switchView() {
        this.root.classList.toggle('view-hide');
    }

    /**
     * Create event handlers for card actions
     * @param nomination Nomination
     */
    private createCardEvents(nomination: Nomination): NominationCardEvents {
        return {
            focus: () => { this.events.focus(nomination) },
            openBs: () => {
                if (service.version.full) {
                    window.open(nomination.bsUrl, '_blank', 'noopener');
                } else {
                    eliUtil.copy(nomination.id);
                    this.events.alert(i18next.t(StringKey.messageBsIdCopied, { id: nomination.id }));
                }
            },
            openDetails: () => this.events.openDetails(nomination),
        }
    }
};
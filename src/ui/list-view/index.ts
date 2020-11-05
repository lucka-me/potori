import i18next from 'i18next';

import { eli } from 'ui/eli';
import { service } from 'service';
import Nomination from 'service/nomination';
import UIPrototype from 'ui/base';

import NominationCard, { NominationCardEvents } from './card';

interface ListViewEvents {
    alert: (message: string) => void;
    focus: (nomination: Nomination) => void;
    openDetails: (nomination: Nomination) => void;
}

class ListView extends UIPrototype {

    private root: HTMLDivElement = null;
    private now = Date.now();

    events: ListViewEvents = {
        alert:          () => { },
        focus:          () => { },
        openDetails:    () => { },
    };

    init(parent: HTMLElement) {
        super.init(parent);
        this.render();
    }

    render() {
        this.root = eli.build('div', {
            className: [
                'flex--1',
                'flex-box-col',
                'view-hide',
            ].join(' '),
            cssText: [
                'height: 100%',
                'min-width: 300px',
                'padding: 4px',
                'box-sizing: border-box',
                'overflow-y: auto',
                'scroll-behavior: smooth',
                '-webkit-overflow-scrolling: touch',
            ].join(';'),
        });
        this.parent.append(this.root);
    }

    clear() { this.root.innerHTML = ''; }

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
        this.root.scrollTo(
            0, document.getElementById(`card-${id}`).offsetTop - top
        );
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
                    const textarea = eli.build('textarea', {
                        value: nomination.id, readOnly: true
                    });
                    document.body.append(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    textarea.remove();
                    this.events.alert(i18next.t('message:ui.list-view.bsIdCopied', { id: nomination.id }));
                }
            },
            openDetails: () => this.events.openDetails(nomination),
        }
    }
};

export default ListView;
import FilterCard from './dashboard/FilterCard';
import Nomination from '../service/Nomination';
import NominationCard from "./list-view/NominationCard";
import { StatusReason, StatusType } from '../service/status';
import UIKitPrototype, { Eli } from './UIKitPrototype';

interface ListViewEvents {
    focus: (nomination: Nomination) => void;
    openDetails: (nomination: Nomination) => void;
}

class ListView extends UIKitPrototype {

    root: HTMLDivElement = null;
    now = Date.now();

    events: ListViewEvents = {
        focus:          () => { },
        openDetails:    () => { },
    };

    init(parent: HTMLElement) {
        super.init(parent);
        this.render();
    }

    render() {
        this.root = Eli.build('div', {
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
                'overflow-y: scroll',
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
            const card = NominationCard.build(nomination, this.now, {
                openDetails: () => this.events.openDetails(nomination),
                focus: () => { this.events.focus(nomination) },
            });
            NominationCard.update(nomination, card);
            if (nomination.lngLat) {
                NominationCard.updateLocation(nomination, card);
            }
            return card;
        });
        this.root.append(...cards);
    }

    updateVisibility(nomination: Nomination, card: HTMLDivElement) {
        if (nomination.status instanceof StatusReason) {
            card.hidden = !FilterCard.reasons.get(nomination.status).checked;
        } else if (nomination.status instanceof StatusType) {
            card.hidden = !FilterCard.types.get(nomination.status).checked;
        }
    }

    update(nomination: Nomination) {
        const card = this.root.querySelector(`#card-${nomination.id}`) as HTMLDivElement;
        NominationCard.update(nomination, card);
        NominationCard.updateLocation(nomination, card);
        this.updateVisibility(nomination, card);
    }
};

export default ListView;
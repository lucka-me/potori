import NominationCard from "./card";
import UIPrototype, { eli, Nomination }  from '../base';

interface ListViewEvents {
    focus: (nomination: Nomination) => void;
    openDetails: (nomination: Nomination) => void;
}

class ListView extends UIPrototype {

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

    update(nomination: Nomination, visibility: boolean) {
        const card = this.root.querySelector(`#card-${nomination.id}`) as HTMLDivElement;
        NominationCard.update(nomination, card);
        NominationCard.updateLocation(nomination, card);
        card.hidden = !visibility;
    }
};

export default ListView;
import { BrainstormingStats } from 'service/brainstorming';
import { base as bsBase } from './base';
import { base } from 'ui/dashboard/base';
import Nomination from 'service/nomination';

import BSBasicCard      from './basic';
import BSRatesCard      from './rates';
import BSReviewsCard    from './reviews';
import BSSynchCard      from './synch';

interface BSGroupEvents {
    analyse: (nominations: Array<Nomination>) => BrainstormingStats;
}

class BSGroup extends base.CardPrototype {

    basic   = new BSBasicCard();
    rates   = new BSRatesCard();
    synch   = new BSSynchCard();
    reviews = new BSReviewsCard();

    events: BSGroupEvents = {
        analyse: () => {
            return {
                review: 0,
                nomination: 0,
                rate: new Map(),
                reviewTimes: [],
                synch: { total: 0, synched: 0 },
            };
        },
    };

    constructor() {
        super();
        Object.defineProperty(this, 'events', { enumerable: false });
    }

    init(parent: HTMLElement) {
        this.forEach((card) => {
            card.init(parent);
        });
    }

    update(nominations: Array<Nomination>) {
        const stats = this.events.analyse(nominations);
        this.forEach((card) => {
            card.updateStats(stats);
        });
    }

    updateStyle() {
        this.forEach((card) => {
            card.updateStyle();
        });
    }

    setVisible(visible: boolean) {
        this.forEach((card) => {
            card.setVisible(visible);
        });
    }

    forEach(callback: (card: bsBase.CardPrototype) => void) {
        Object.values(this).forEach(callback);
    }
}

export default BSGroup;
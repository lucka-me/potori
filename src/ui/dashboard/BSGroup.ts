import { DashboardPrototype } from './base';

import BSBasicCard      from './brainstorming/BSBasicCard';
import BSRatesCard      from './brainstorming/BSRatesCard';
import BSSynchCard      from './brainstorming/BSSynchCard';
import BSReviewsCard    from './brainstorming/BSReviewsCard';
import { DashboardBsPrototype, BrainstormingStats } from './brainstorming/prototypes';
import { Nomination } from '../../service';

interface BSGroupEvents {
    analyse: (nominations: Array<Nomination>) => BrainstormingStats;
}

class BSGroup extends DashboardPrototype {

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

    forEach(callback: (card: DashboardBsPrototype) => void) {
        Object.values(this).forEach(callback);
    }
}

export default BSGroup;
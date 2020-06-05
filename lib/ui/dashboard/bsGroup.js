import { DashboardPrototype } from './Prototype.js';

import { BSBasicCard    } from './brainstorming/Basic.js';
import { BSRatesCard    } from './brainstorming/Rates.js';
import { BSSynchCard    } from './brainstorming/Synch.js';
import { BSReviewsCard  } from './brainstorming/Reviews.js';

class BSGroup extends DashboardPrototype {
    constructor() {
        super();
        this.card = {
            basic:      new BSBasicCard(),
            rates:      new BSRatesCard(),
            synch:      new BSSynchCard(),
            reviews:    new BSReviewsCard(),
        }
    }
    
    init(parent) {
        for (const card of Object.keys(this.card)) {
            this.card[card].init(parent);
        }
    }

    update() {
        const stats = process.analyseBs();
        for (const key of Object.keys(this.card)) {
            this.card[key].update(stats);
        }
    }

    updateStyle() {
        for (const card of Object.keys(this.card)) {
            this.card[card].updateStyle();
        }
    }

    setVisible(visible) {
        for (const card of Object.keys(this.card)) {
            this.card[card].setVisible(visible);
        }
    }
}

export { BSGroup };
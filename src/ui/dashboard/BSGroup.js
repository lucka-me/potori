import { DashboardPrototype } from './prototypes.js';

import BSBasicCard      from './brainstorming/BSBasicCard.js';
import BSRatesCard      from './brainstorming/BSRatesCard.js';
import BSSynchCard      from './brainstorming/BSSynchCard.js';
import BSReviewsCard    from './brainstorming/BSReviewsCard.js';
import Service from '../../service/Service.js';

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

    update(portals) {
        const stats = Service.bs.analyse(portals);
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

export default BSGroup;
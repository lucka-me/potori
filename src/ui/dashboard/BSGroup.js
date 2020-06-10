import { DashboardPrototype } from './prototypes';

import BSBasicCard      from './brainstorming/BSBasicCard.js';
import BSRatesCard      from './brainstorming/BSRatesCard';
import BSSynchCard      from './brainstorming/BSSynchCard';
import BSReviewsCard    from './brainstorming/BSReviewsCard';
import Service from '../../service/Service';

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
        this.card.basic.events.refresh = () => {
            Service.updateBsData();
        };
    }

    update(portals) {
        const stats = Service.bs.analyse(portals);
        for (const key of Object.keys(this.card)) {
            this.card[key].updateStatus(stats);
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
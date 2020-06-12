import { DashboardPrototype } from './prototypes';

import BSBasicCard      from './brainstorming/BSBasicCard';
import BSRatesCard      from './brainstorming/BSRatesCard';
import BSSynchCard      from './brainstorming/BSSynchCard';
import BSReviewsCard    from './brainstorming/BSReviewsCard';
import Service from '../../service/Service';
import { DashboardBsPrototype } from './brainstorming/prototypes';
import Nomination from '../../service/Nomination';

class BSGroup extends DashboardPrototype {

    basic   = new BSBasicCard();
    rates   = new BSRatesCard();
    synch   = new BSSynchCard();
    reviews = new BSReviewsCard();

    init(parent: HTMLElement) {
        this.forEach((card) => {
            card.init(parent);
        });
        this.basic.events.refresh = () => {
            Service.updateBsData();
        };
    }

    update(nominations: Array<Nomination>) {
        const stats = Service.bs.analyse(nominations);
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
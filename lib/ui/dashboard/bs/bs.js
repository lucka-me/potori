class BsCard extends DashboardPrototype {
    constructor() {
        super();
        this.card = {
            basic:      new BsBasicCard(),
            rates:      new BsRatesCard(),
            synch:      new BsSynchCard(),
            reviews:    new BsRatesCard(),
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
};
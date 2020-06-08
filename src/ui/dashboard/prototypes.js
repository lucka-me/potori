import UIKitPrototype from "../UIKitPrototype";

export class DashboardPrototype extends UIKitPrototype {
    constructor() {
        super();
        this.root = null;
    }
    init(parent) { parent }
    update(portals) { portals }
    updateStyle() { }
    setVisible(visible) { this.root.hidden = !visible; }
}

export class DashboardChartProtorype extends DashboardPrototype {
    constructor() {
        super();
        this.chart = null;
    }

    static get color() {
        return {
            border: 'rgba(0, 0, 0, 0.2)',
            borderHover: 'rgba(0, 0, 0, 0.4)',
        };
    }
}
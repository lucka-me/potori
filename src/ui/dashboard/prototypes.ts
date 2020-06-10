import UIKitPrototype, { Eli } from "../UIKitPrototype";
import Nomination from "../../service/Nomination";

export class DashboardPrototype extends UIKitPrototype {

    root: HTMLElement = null;

    constructor() {
        super();
    }
    init(parent: HTMLElement) { parent }
    update(nominations: Array<Nomination>) { nominations }
    updateStyle() { }
    setVisible(visible: boolean) { this.root.hidden = !visible; }
}

export class DashboardChartProtorype extends DashboardPrototype {

    chart: Chart = null;

    constructor() {
        super();
    }

    static get color() {
        return {
            border: 'rgba(0, 0, 0, 0.2)',
            borderHover: 'rgba(0, 0, 0, 0.4)',
        };
    }
}

export { Eli, Nomination };
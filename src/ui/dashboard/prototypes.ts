import UIKitPrototype, { Eli, i18next } from "../UIKitPrototype";
import Nomination from "../../service/Nomination";

export class DashboardPrototype extends UIKitPrototype {

    root: HTMLElement = null;

    constructor() {
        super();
        Object.defineProperty(this, 'root', {
            enumerable: false,
        });
    }
    update(nominations: Array<Nomination>) { nominations }
    updateStyle() { }
    setVisible(visible: boolean) {
        if (!this.root) {
            if (!visible) return;
            this.render();
        }
        this.root.hidden = !visible;
    }
}

export class DashboardChartProtorype extends DashboardPrototype {

    chart: Chart = null;

    static get color() {
        return {
            border: 'rgba(0, 0, 0, 0.2)',
            borderHover: 'rgba(0, 0, 0, 0.4)',
        };
    }
}

export { Eli, Nomination, i18next };
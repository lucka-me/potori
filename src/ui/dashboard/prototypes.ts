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

/**
 * Extended Eli with chart-card-related functions
 */
export class EliChartCard extends Eli {

    /**
     * Build a MDC card with chart inside
     * @param title     Title of the card
     * @param canvas    Canvas element for the chart
     * @param flex      Flex size of the card
     * @param minWidth  Mininum width fo the card
     * @returns The card element
     */
    static chartCard(
        title: string, canvas: HTMLCanvasElement, flex: number, minWidth: number
    ): HTMLDivElement {
        return Eli.build('div', {
            className: [
                'mdc-card',
                'mdc-card--outlined',
                'padding--8',
                `flex--${flex}`,
                'flex-shrink--1'
            ].join(' '),
            cssText: `min-width:${minWidth}px`,
        }, [
            Eli.build('span', {
                className: 'mdc-typography--headline6',
                innerHTML: title,
            }),
            Eli.build('div', {
                className: 'container-chart',
            }, [ canvas ]),
        ]);
    }
}

export { Eli, Nomination, i18next };
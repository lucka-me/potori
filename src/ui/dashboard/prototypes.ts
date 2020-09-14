import moment from 'moment';

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

    /**
     * Build a MDC card with chart inside
     * @param title     Title of the card
     * @param canvas    Canvas element for the chart
     * @param flex      Flex size of the card
     * @param minWidth  Mininum width fo the card
     * @returns The card element
     */
    static buildChartCard(
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

    /**
     * Fill the <time, data> map with empty months
     * @param dataMap The map to be filled
     * @param start Start time
     * @param end End time
     */
    static fillTimeDataMap(dataMap: Map<number, number>, start: number, end: number) {
        let scan = start;
        while (scan <= end) {
            const month = moment(scan + 1000).startOf('month');
            const key = month.valueOf();
            if (!dataMap.has(key)) dataMap.set(key, 0);
            scan = month.endOf('month').valueOf();
        }
    }
}

export { Eli, Nomination, i18next };
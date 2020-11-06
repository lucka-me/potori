import moment from 'moment';

import { eli } from 'eli/eli';
import { eliCard } from 'eli/card';
import Nomination from 'service/nomination';
import UIPrototype from 'ui/base';

export namespace base {
    export class CardPrototype extends UIPrototype {

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

    export class ChartCardProtorype extends CardPrototype {
        chart: Chart = null;
    }

    export function eliChartCard(name: string, title: string, canvas: HTMLCanvasElement) {
        return eliCard(name, [
            eli('div', { className: 'content' }, [
                eli('span', { className: 'title', innerHTML: title }),
                eli('div', { className: 'chart-container' }, [ canvas ]),
            ]),
        ]);
    }

    /**
     * Build a MDC card with chart inside
     * @param title     Title of the card
     * @param canvas    Canvas element for the chart
     * @param flex      Flex size of the card
     * @param minWidth  Mininum width fo the card
     * @returns The card element
     */
    export function buildChartCard(
        title: string, canvas: HTMLCanvasElement, flex: number, minWidth: number
    ): HTMLDivElement {
        return eli('div', {
            className: [
                'mdc-card',
                'mdc-card--outlined',
                'padding--8',
                `flex--${flex}`,
                'flex-shrink--1'
            ].join(' '),
            cssText: `min-width:${minWidth}px`,
        }, [
            eli('span', {
                className: 'mdc-typography--headline6',
                innerHTML: title,
            }),
            eli('div', {
                className: 'chart-container',
            }, [ canvas ]),
        ]);
    }

    /**
     * Fill the <time, data> map with empty months
     * @param dataMap The map to be filled
     * @param start Start time
     * @param end End time
     */
    export function fillTimeDataMap(dataMap: Map<number, number>, start: number, end: number) {
        let scan = start;
        while (scan <= end) {
            const month = moment(scan + 1000).startOf('month');
            const key = month.valueOf();
            if (!dataMap.has(key)) dataMap.set(key, 0);
            scan = month.endOf('month').valueOf();
        }
    }
}
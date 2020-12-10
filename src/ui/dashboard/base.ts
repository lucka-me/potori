import moment from 'moment';

import { base as uiBase } from 'ui/base';
import { eli } from '@lucka-labs/eli';
import { eliCard } from 'eli/card';
import Nomination from 'service/nomination';

export namespace base {
    export class CardPrototype extends uiBase.Prototype {

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

    /**
     * Build a MDC card with chart inside
     * @param name      CSS name of the card
     * @param title     Title of the card
     * @param canvas    Canvas element for the chart
     * @returns The card element
     */
    export function eliChartCard(name: string, title: string, canvas: HTMLCanvasElement) {
        return eliCard(name, [
            eli('div', { className: 'content' }, [
                eli('span', { className: 'title', innerHTML: title }),
                eli('div', { className: 'chart-container' }, [ canvas ]),
            ]),
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
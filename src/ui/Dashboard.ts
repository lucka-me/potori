import Chart from 'chart.js';

import BSGroup              from './dashboard/BSGroup';
import CountByMonthCard     from './dashboard/CountByMonthCard';
import FilterCard           from './dashboard/FilterCard';
import MapCard              from './dashboard/MapCard';
import QuotasCard           from './dashboard/QuotasCard';
import StatsRejectedCard    from './dashboard/StatsRejectedCard';
import StatsTypeCard        from './dashboard/StatsTypeCard';
import UIKitPrototype, { Eli } from './UIKitPrototype';
import { DashboardPrototype, Nomination } from './dashboard/prototypes';

class Dashboard extends UIKitPrototype {

    root: HTMLDivElement = null;

    map             = new MapCard;
    filter          = FilterCard;
    statsType       = new StatsTypeCard();
    statsRejected   = new StatsRejectedCard();
    countByMonth    = new CountByMonthCard();
    quotas          = new QuotasCard();
    bs              = new BSGroup();

    constructor() {
        super();
        Object.defineProperty(this, 'root', {
            enumerable: false,
        });
    }

    init(parent: HTMLElement) {
        Chart.platform.disableCSSInjection = true;
        Chart.defaults.global.legend.labels.boxWidth = 10;
        Chart.defaults.global.maintainAspectRatio = false;
        Chart.defaults.line.tooltips = { intersect: false, };
        Chart.defaults.doughnut.tooltips = {
            callbacks: {
                label: (item, data) => {
                    const dataset = data.datasets[item.datasetIndex];
                    const meta = (dataset as any)._meta;
                    const metadata = meta[Object.keys(meta)[0]].data;
                    const total = (dataset.data as number[]).reduce(
                        (acc: number, cur: number, index: number) => {
                            return acc + (metadata[index].hidden ? 0 : cur);
                        },
                        0
                    );
                    const value = dataset.data[item.index] as number;
                    const percentage = ((value / total) * 100).toFixed(2);
                    return `${data.labels[item.index]}: ${value} (${percentage}%)`;
                },
            },
        } as Chart.ChartTooltipOptions;
        // Fix for #6890, should remove when upgrade to 3.0
        Chart.defaults.radar.tooltips = {
            intersect: false,
            callbacks: {
                title: (items, data) => data.labels[items[0].index],
            },
        } as Chart.ChartTooltipOptions;

        this.root = Eli.build('div', {
            className: [
                'flex--2',
                'flex-box-row--wrap',
                'flex-align-items--start',
                'flex-align-content--start',
                'padding--4',
                'dashboard',
            ].join(' '),
            cssTest: [
                'height: 100%',
                'box-sizing: border-box',
                'overflow-y: scroll',
                'scroll-behavior: smooth',
                '-webkit-overflow-scrolling: touch',
            ].join(';'),
        });
        parent.appendChild(this.root);
        this.forEach((card) => {
            card.init(this.root);
        });
    }

    refresh(nominations: Array<Nomination>) {
        this.forEach((card) => {
            card.update(nominations);
        });
    }

    update(nominations: Array<Nomination>) {
        this.map.update(nominations);
        this.statsType.update(nominations);
        this.statsRejected.update(nominations);
        this.countByMonth.update(nominations);
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
        this.map.resize();
    }

    forEach(callback: (card: DashboardPrototype) => void) {
        for (const card of Object.values(this)) {
            callback(card);
        }
    }
}

export default Dashboard;
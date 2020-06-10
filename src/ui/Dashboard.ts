import * as Chart from 'chart.js';

import BSGroup              from './dashboard/BSGroup';
import CountByMonthCard     from './dashboard/CountByMonthCard';
import FilterCard           from './dashboard/FilterCard';
import MapCard              from './dashboard/MapCard';
import QuotasCard           from './dashboard/QuotasCard';
import StatsRejectedCard    from './dashboard/StatsRejectedCard';
import StatsTypeCard        from './dashboard/StatsTypeCard';
import UIKitPrototype, { Eli } from './UIKitPrototype';
import { DashboardPrototype, Nomination } from './dashboard/prototypes';
import Service from '../service/Service';

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
    }

    init(parent: HTMLElement) {
        Chart.defaults.global.legend.labels.boxWidth = 10;
        Chart.defaults.global.maintainAspectRatio = false;
        Chart.defaults.line.tooltips = { intersect: false, };
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
            styleText: [
                'height: 100%',
                'box-sizing: border-box',
                'overflow-y: scroll',
                'scroll-behavior: smooth',
                '-webkit-overflow-scrolling: touch',
            ].join(';'),
        }) as HTMLDivElement;
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
        this.map.update(Service.nominations);
    }

    setVisible(visible: boolean) {
        this.forEach((card) => {
            card.setVisible(visible);
        });
        if (this.map.loaded) this.map.ctrl.resize();
    }

    forEach(callback: (card: DashboardPrototype) => void) {
        for (const [key, value] of Object.entries(this)) {
            if (key === 'root') continue;
            callback(value);
        }
    }
}

export default Dashboard;
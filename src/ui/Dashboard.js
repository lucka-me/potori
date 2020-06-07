import { UIKitPrototype } from './protorypes.js';
import Eli from "./Eli.js";

import MapCard              from './dashboard/MapCard.js';
import FilterCard           from './dashboard/FilterCard.js';
import StatsTypeCard        from './dashboard/StatsTypeCard.js';
import StatsRejectedCard    from './dashboard/StatsRejectedCard.js';
import CountByMonthCard     from './dashboard/CountByMonthCard.js';
import QuotasCard           from './dashboard/QuotasCard.js';
import BSGroup              from './dashboard/BSGroup.js';

class Dashboard extends UIKitPrototype {
    constructor() {
        super();
        this.root = null;

        this.map            = new MapCard();
        this.filter         = FilterCard;
        this.statsType      = new StatsTypeCard();
        this.statsRejected  = new StatsRejectedCard();
        this.countByMonth   = new CountByMonthCard();
        this.quotas         = new QuotasCard();
        this.bs             = new BSGroup();
    }

    init(parent) {
        Chart.defaults.global.legend.labels.boxWidth = 10;
        Chart.defaults.global.maintainAspectRatio = false;
        Chart.defaults.line.tooltips = { intersect: false, };
        // Fix for #6890, should remove when upgrade to 3.0
        Chart.defaults.radar.tooltips = {
            intersect: false,
            callbacks: {
                title: (items, data) => data.labels[items[0].index],
            }
        }

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
        });
        parent.appendChild(this.root);
        this.forEach((card) => {
            card.init(this.root);
        });
    }

    refresh(portals) {
        this.forEach((card) => {
            card.update(portals);
        });
    }

    update(portals) {
        this.map.update(portals);
        this.statsType.update(portals);
        this.statsRejected.update(portals);
        this.countMonth.update(portals);
    }

    updateStyle() {
        this.forEach((card) => {
            card.updateStyle();
        });
    }

    setVisible(visible) {
        this.forEach((card) => {
            card.setVisible(visible);
        });
        if (this.map.loaded()) this.map.ctrl.resize();
    }

    forEach(callback) {
        for (const key of Object.keys(this)) {
            if (key === 'root') continue;
            callback(this[key]);
        }
    }
}

export default Dashboard;
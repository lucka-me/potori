import { UIKitPrototype } from './Protorype.js';
import { Eli } from "./Eli.js";

import { MapCard            } from './dashboard/Map.js';
import { FilterCard         } from './dashboard/Filter.js';
import { StatsTypeCard      } from './dashboard/StatsType.js';
import { StatsRejectedCard  } from './dashboard/StatsRejected.js';
import { CountMonthCard     } from './dashboard/CountMonth.js';
import { QuotasCard         } from './dashboard/Quotas.js';
import { BSGroup            } from './dashboard/BSGroup.js';

class Dashboard extends UIKitPrototype {
    constructor() {
        super();
        this.root = null;

        this.map            = new MapCard();
        this.filter         = new FilterCard();
        this.statsType      = new StatsTypeCard();
        this.statsRejected  = new StatsRejectedCard();
        this.countMonth     = new CountMonthCard();
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

    refresh() {
        this.forEach((card) => {
            card.update();
        });
    }

    update() {
        this.map.update();
        this.statsType.update();
        this.statsRejected.update();
        this.countMonth.update();
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

export { Dashboard };
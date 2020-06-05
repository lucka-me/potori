import { UIKitPrototype } from './prototype.js';

class DashboardKit extends UIKitPrototype {
    constructor() {
        super();
        this.root = null;
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

        this.root = eliKit.build('div', {
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
        for (const card of Object.keys(dashboard)) {
            dashboard[card].init(this.root);
        }
    }

    refresh() {
        for (const card of Object.keys(dashboard)) {
            dashboard[card].update();
        }
    }

    update() {
        dashboard.map.update();
        dashboard.statsType.update();
        dashboard.statsRejected.update();
        dashboard.countMonth.update();
    }

    updateStyle() {
        for (const card of Object.keys(dashboard)) {
            dashboard[card].updateStyle();
        }
    }

    setVisible(visible) {
        for (const card of Object.keys(dashboard)) {
            dashboard[card].setVisible(visible);
        }
        if (dashboard.map.loaded()) dashboard.map.ctrl.resize();
    }
}

export { DashboardKit };
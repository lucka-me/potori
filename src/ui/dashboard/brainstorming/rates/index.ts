import Chart from 'chart.js';
import i18next from 'i18next';

import { eli } from '@lucka-labs/eli';
import { BrainstormingStats, RateItems } from 'service/brainstorming';
import { base } from 'ui/dashboard/brainstorming/base';

import './style.scss';

import { StringKey } from './constants';

class BSRatesCard extends base.ChartCardPrototype {
    render() {
        const canvasChart = eli('canvas', { });
        this.root = base.eliChartCard('bs-rates-card', i18next.t(StringKey.title), canvasChart);
        this.setVisible(false);
        this.parent.append(this.root);

        const labels: Array<string> = [];
        for (const value of Object.values(RateItems)) {
            labels.push(i18next.t(value));
        }

        const style = getComputedStyle(document.documentElement);
        this.chart = new Chart(canvasChart.getContext('2d'), {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    data: [],
                    borderColor: style.getPropertyValue('--mdc-theme-primary'),
                    pointRadius: 0,
                }],
            },
            options: {
                legend: { display: false, },
                scale: {
                    ticks: {
                        display: false,
                        min: 1, max: 5, stepSize: 1,
                    },
                    angleLines: {
                        color: style.getPropertyValue('--mdc-theme-text-disabled-on-light'),
                    },
                    gridLines: {
                        color: style.getPropertyValue('--mdc-theme-text-disabled-on-light'),
                    },
                },
            },
        });
    }

    updateStats(stats: BrainstormingStats) {
        const data = [];
        for (const rate of Object.keys(RateItems)) {
            const list = stats.rate.get(rate);
            const avg = list.reduce((pre, cur) => pre + cur, 0) / list.length;
            data.push(parseFloat(avg.toFixed(2)));
        }
        this.chart.data.datasets[0].data = data;
        this.chart.update();
    }

    updateStyle() {
        if (!this.chart) return;
        const style = getComputedStyle(document.documentElement);
        this.chart.data.datasets[0].borderColor = style.getPropertyValue('--mdc-theme-primary');
        this.chart.options.scale.angleLines.color = style.getPropertyValue('--mdc-theme-text-disabled-on-light');
        this.chart.options.scale.gridLines.color = style.getPropertyValue('--mdc-theme-text-disabled-on-light');
        this.chart.update();
    }
}

export default BSRatesCard;
import Chart from 'chart.js';

import { DashboardBsChartPrototype, Eli, BrainstormingStats } from './prototypes';
import { RateItems } from '../../../service/BrainstormingKit';

class BSRatesCard extends DashboardBsChartPrototype {
    constructor() { super(); }

    init(parent: HTMLElement) {
        const canvasChart = Eli.build('canvas', { className: 'canvas-chart--h' }) as HTMLCanvasElement;
        this.root = Eli.chartCard('Brainstorming Rates', canvasChart, 1, 240);
        this.setVisible(false);
        parent.appendChild(this.root);

        const labels: Array<string> = [];
        for (const value of Object.values(RateItems)) {
            labels.push(value);
        }

        const style = getComputedStyle(document.documentElement);
        this.chart = new Chart(canvasChart.getContext('2d'), {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    data: [],
                    borderColor: style.getPropertyValue('--mdc-theme-primary'),
                    hoverBorderColor: style.getPropertyValue('--mdc-theme-primary'),
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
        this.chart.data.datasets[0].hoverBorderColor = style.getPropertyValue('--mdc-theme-primary');
        this.chart.options.scale.angleLines.color = style.getPropertyValue('--mdc-theme-text-disabled-on-light');
        this.chart.options.scale.gridLines.color = style.getPropertyValue('--mdc-theme-text-disabled-on-light');
        this.chart.update();
    }
}

export default BSRatesCard;
import { DashboardChartProtorype } from './prototypes';
import Eli from "../Eli";
import * as Chart from 'chart.js';
import Nomination from '../../service/Nomination';

class QuotasCard extends DashboardChartProtorype {
    constructor() { super(); }

    init(parent: HTMLElement) {
        const canvasChart = Eli.build('canvas', { className: 'canvas-chart--h' }) as HTMLCanvasElement;
        this.root = Eli.chartCard('Quotas', canvasChart, 2, 200);

        this.setVisible(false);
        parent.appendChild(this.root);

        const labels = [];
        for (let i = 1; i < 15; i++) {
            labels.push(`${i}`);
        }
        const style = getComputedStyle(document.documentElement);
        this.chart = new Chart(canvasChart.getContext('2d'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    data: [],
                    borderColor: style.getPropertyValue('--mdc-theme-primary'),
                    pointHoverBorderColor: style.getPropertyValue('--mdc-theme-primary'),
                }],
            },
            options: {
                legend: { display: false, },
                scales: {
                    yAxes: [{ ticks: { beginAtZero: true, }, }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Day'
                        },
                    }],
                },
            },
        });
    }

    update(nominations: Array<Nomination>) {
        const data = new Array(14).fill(0);
        const now = Date.now();
        for (const nomination of nominations) {
            const restoreTime = nomination.confirmedTime + (14 * 24 * 3600 * 1000);
            if (restoreTime > now) {
                data[Math.floor((restoreTime - now) / (24 * 3600 * 1000))] += 1;
            }
        }
        this.chart.data.datasets[0].data = data;
        this.chart.update();
    }

    updateStyle() {
        if (!this.chart) return;
        const style = getComputedStyle(document.documentElement);
        this.chart.data.datasets[0].borderColor = style.getPropertyValue('--mdc-theme-primary');
        this.chart.data.datasets[0].hoverBorderColor = style.getPropertyValue('--mdc-theme-primary');
        this.chart.update();
    }
}

export default QuotasCard;
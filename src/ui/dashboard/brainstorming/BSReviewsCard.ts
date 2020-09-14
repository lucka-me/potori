import Chart from 'chart.js';
import moment from 'moment';

import { DashboardBsChartPrototype, BrainstormingStats, Eli, i18next } from './prototypes';

class BSReviewsCard extends DashboardBsChartPrototype {
    render() {
        const canvasChart = Eli.build('canvas', { className: 'canvas-chart--h' });
        this.root = DashboardBsChartPrototype.buildChartCard(i18next.t('Brainstorming Reviews'), canvasChart, 3, 300);
        this.setVisible(false);
        this.parent.append(this.root);

        const style = getComputedStyle(document.documentElement);
        this.chart = new Chart(canvasChart.getContext('2d'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: i18next.t('Reviews'),
                    data: [],
                    borderColor: style.getPropertyValue('--mdc-theme-primary'),
                    pointRadius: 0,
                }],
            },
            options: {
                legend: { display: false, },
                scales: {
                    yAxes: [{
                        ticks: { beginAtZero: true, },
                    }],
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'month',
                            tooltipFormat: 'YYYY-MM',
                            displayFormats: { month: 'YYYY-MM', }
                        },
                    }],
                },
            }
        });
    }

    updateStats(stats: BrainstormingStats) {
        if (stats.reviewTimes.length < 1) {
            this.chart.data.datasets[0].data = [];
            this.chart.update();
            return;
        }
        const mapTimes = new Map();
        let min = moment(stats.reviewTimes[0]).startOf('month').valueOf();
        let max = min;
        for (const time of stats.reviewTimes) {
            const sub = moment(time).startOf('month').valueOf();
            if (sub < min) min = sub;
            else if (sub > max) max = sub;
            if (mapTimes.has(sub)) {
                mapTimes.set(sub, mapTimes.get(sub) + 1);
            } else {
                mapTimes.set(sub, 1);
            }
        }
        DashboardBsChartPrototype.fillTimeDataMap(mapTimes, min, max);
        const dataTimes: Array<{ t: number, y: number }> = [];
        mapTimes.forEach((value, key) => {
            dataTimes.push({ t: key, y: value, });
        })
        dataTimes.sort((a, b) => a.t - b.t);
        this.chart.data.datasets[0].data = dataTimes;
        this.chart.update();
    }

    updateStyle() {
        if (!this.chart) return;
        const style = getComputedStyle(document.documentElement);
        this.chart.data.datasets[0].borderColor = style.getPropertyValue('--mdc-theme-primary');
        this.chart.update();
    }
}

export default BSReviewsCard;
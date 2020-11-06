import Chart from 'chart.js';
import i18next from 'i18next';
import moment from 'moment';

import { eli } from 'eli/eli';
import { BrainstormingStats } from 'service/brainstorming';
import { base } from 'ui/dashboard/brainstorming/base';

import './style.scss';

import { StringKey } from './constants';

class BSReviewsCard extends base.ChartCardPrototype {
    render() {
        const canvasChart = eli('canvas', { });
        this.root = base.eliChartCard('bs-reviews-card', i18next.t(StringKey.title), canvasChart);
        this.setVisible(false);
        this.parent.append(this.root);

        const style = getComputedStyle(document.documentElement);
        this.chart = new Chart(canvasChart.getContext('2d'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: i18next.t('ui.dashboard.brainstorming.reviews.desc'),
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
        base.fillTimeDataMap(mapTimes, min, max);
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
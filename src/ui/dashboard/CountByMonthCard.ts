import Chart from 'chart.js';
import moment from 'moment';

import { DashboardChartProtorype, Eli, Nomination } from './prototypes';
import TimeKit from "../TimeKit";

class CountByMonthCard extends DashboardChartProtorype {
    constructor() { super(); }

    init(parent: HTMLElement) {
        const canvasChart = Eli.build('canvas', { className: 'canvas-chart--h' });
        this.root = Eli.chartCard('Count by Month', canvasChart, 3, 300);
        this.setVisible(false);
        parent.appendChild(this.root);

        const style = getComputedStyle(document.documentElement);
        this.chart = new Chart(canvasChart.getContext('2d'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Submissions',
                    data: [],
                    borderColor: style.getPropertyValue('--mdc-theme-primary'),
                    pointHoverBorderColor: style.getPropertyValue('--mdc-theme-primary'),
                    fill: false,
                }, {
                    label: 'Results',
                    data: [],
                    borderColor: style.getPropertyValue('--mdc-theme-secondary'),
                    pointHoverBorderColor: style.getPropertyValue('--mdc-theme-secondary'),
                    fill: false,
                }],
            },
            options: {
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
                tooltips: { mode: 'x', },
            }
        });
    }

    update(nominations: Array<Nomination>) {
        if (nominations.length === 0) {
            this.chart.data.datasets[0].data = [];
            this.chart.data.datasets[1].data = [];
            this.chart.update();
            return;
        }
        const mapSub = new Map<number, number>();
        const mapRet = new Map<number, number>();
        let min = moment(nominations[0].confirmedTime).startOf('month').valueOf();
        let max = min;
        for (const nomination of nominations) {
            const sub = moment(nomination.confirmedTime).startOf('month').valueOf();
            if (sub < min) min = sub;
            else if (sub > max) max = sub;
            if (mapSub.has(sub)) {
                mapSub.set(sub, mapSub.get(sub) + 1);
            } else {
                mapSub.set(sub, 1);
            }
            if (!nomination.resultTime) continue;
            const ret = moment(nomination.resultTime).startOf('month').valueOf();
            if (ret > max) max = ret;
            if (mapRet.has(ret)) {
                mapRet.set(ret, mapRet.get(ret) + 1);
            } else {
                mapRet.set(ret, 1);
            }
        }
        // Fill the empty months
        TimeKit.fillTimeDataMap(mapSub, min, max);
        TimeKit.fillTimeDataMap(mapRet, min, max);
        const dataSub: Array<{ t: number, y: number }> = [];
        const dataRet: Array<{ t: number, y: number }> = [];
        mapSub.forEach((value, key) => {
            dataSub.push({ t: key, y: value, });
        });
        mapRet.forEach((value, key) => {
            dataRet.push({ t: key, y: value, });
        })
        dataSub.sort((a, b) => a.t - b.t);
        dataRet.sort((a, b) => a.t - b.t);
        this.chart.data.datasets[0].data = dataSub;
        this.chart.data.datasets[1].data = dataRet;
        this.chart.update();
    }

    updateStyle() {
        if (!this.chart) return;
        const style = getComputedStyle(document.documentElement);
        this.chart.data.datasets[0].borderColor = style.getPropertyValue('--mdc-theme-primary');
        this.chart.data.datasets[0].hoverBorderColor = style.getPropertyValue('--mdc-theme-primary');
        this.chart.data.datasets[1].borderColor = style.getPropertyValue('--mdc-theme-secondary');
        this.chart.data.datasets[1].hoverBorderColor = style.getPropertyValue('--mdc-theme-secondary');
        this.chart.update();
    }
}

export default CountByMonthCard;
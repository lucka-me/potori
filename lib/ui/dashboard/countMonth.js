import { DashboardChartProtorype } from './prototype.js';

class CountMonthCard extends DashboardChartProtorype {
    constructor() { super(); }

    init(parent) {
        const canvasChart = eliKit.build('canvas', { className: 'canvas-chart--h' });
        this.root = eliKit.chartCard('Count by Month', canvasChart, 3, 300);
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

    update() {
        if (process.portals.length === 0) {
            this.chart.data.datasets[0].data = [];
            this.chart.data.datasets[1].data = [];
            this.chart.update();
            return;
        }
        const mapSub = new Map();
        const mapRet = new Map();
        let min = moment(process.portals[0].confirmedTime).startOf('month').valueOf();
        let max = min;
        for (const portal of process.portals) {
            const sub = moment(portal.confirmedTime).startOf('month').valueOf();
            if (sub < min) min = sub;
            else if (sub > max) max = sub;
            if (mapSub.has(sub)) {
                mapSub.set(sub, mapSub.get(sub) + 1);
            } else {
                mapSub.set(sub, 1);
            }
            if (!portal.resultTime) continue;
            const ret = moment(portal.resultTime).startOf('month').valueOf();
            if (ret > max) max = ret;
            if (mapRet.has(ret)) {
                mapRet.set(ret, mapRet.get(ret) + 1);
            } else {
                mapRet.set(ret, 1);
            }
        }
        // Fill the empty months
        toolkit.fillTimeDataMap(mapSub, min, max);
        toolkit.fillTimeDataMap(mapRet, min, max);
        const dataSub = [];
        const dataRet = [];
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

export { CountMonthCard };
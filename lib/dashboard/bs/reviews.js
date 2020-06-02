dashboard.card.bs.card.reviews = {
    _root: null,
    chart: null,
    init() {
        const canvasChart = eliKit.build('canvas', { class: 'canvas-chart--h' });
        this._root = eliKit.build('div', {
            className: 'mdc-card mdc-card--outlined padding--8 flex--3 flex-shrink--1',
            styleText: 'min-width:300px',
            children: [
                eliKit.build('span', {
                    className: 'mdc-typography--headline6',
                    innerHTML: 'Brainstorming Reviews',
                }),
                eliKit.build('div', {
                    className: 'container-chart',
                    children: [ canvasChart ],
                }),
            ],
        });
        this.setVisible(false);
        document.querySelector('#dashboard').appendChild(this._root);

        const style = getComputedStyle(document.documentElement);
        this.chart = new Chart(canvasChart.getContext('2d'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Reviews',
                    data: [],
                    borderColor: style.getPropertyValue('--mdc-theme-primary'),
                    pointHoverBorderColor: style.getPropertyValue('--mdc-theme-primary'),
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
    },
    update(stats) {
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
        toolkit.fillTimeDataMap(mapTimes, min, max);
        const dataTimes = [];
        mapTimes.forEach((value, key) => {
            dataTimes.push({ t: key, y: value, });
        })
        dataTimes.sort((a, b) => a.t - b.t);
        this.chart.data.datasets[0].data = dataTimes;
        this.chart.update();
    },
    updateStyle() {
        if (!this.chart) return;
        const style = getComputedStyle(document.documentElement);
        this.chart.data.datasets[0].borderColor = style.getPropertyValue('--mdc-theme-primary');
        this.chart.data.datasets[0].hoverBorderColor = style.getPropertyValue('--mdc-theme-primary');
        this.chart.update();
    },
    setVisible(visible) { this._root.hidden = !visible; },
};
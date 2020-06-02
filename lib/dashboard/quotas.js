dashboard.card.quotas = {
    _root: null,
    chart: null,
    init() {
        const canvasChart = eliKit.build('canvas', { class: 'canvas-chart--h' });
        this._root = eliKit.build('div', {
            className: 'mdc-card mdc-card--outlined padding--8 flex--2 flex-shrink--1',
            styleText: 'min-width:200px',
            children: [
                eliKit.build('span', {
                    className: 'mdc-typography--headline6',
                    innerHTML: 'Quotas',
                }),
                eliKit.build('div', {
                    className: 'container-chart',
                    children: [ canvasChart ],
                }),
            ],
        });

        this.setVisible(false);
        document.querySelector('#dashboard').appendChild(this._root);

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
    },
    update: () => {
        const data = new Array(14).fill(0);
        const timeNow = Date.now();
        for (const portal of process.portals) {
            const restoreTime = portal.confirmedTime + (14 * 24 * 3600 * 1000);
            if (restoreTime > timeNow) {
                data[Math.floor((restoreTime - timeNow) / (24 * 3600 * 1000))] += 1;
            }
        }
        const chart = dashboard.card.quotas.chart;
        chart.data.datasets[0].data = data;
        chart.update();
    },
    updateStyle: () => {
        const chart = dashboard.card.quotas.chart;
        if (!chart) return;
        const style = getComputedStyle(document.documentElement);
        chart.data.datasets[0].borderColor = style.getPropertyValue('--mdc-theme-primary');
        chart.data.datasets[0].hoverBorderColor = style.getPropertyValue('--mdc-theme-primary');
        chart.update();
    },
    setVisible(visible) { this._root.hidden = !visible; },
};
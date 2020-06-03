dashboard.card.bs.card.rates = {
    root: null,
    chart: null,
    init() {
        const canvasChart = eliKit.build('canvas', { className: 'canvas-chart--h' });
        this.root = eliKit.chartCard('Brainstorming Rates', canvasChart, 1, 240);
        this.setVisible(false);
        document.querySelector('#dashboard').appendChild(this.root);

        const labels = [];
        for (const key of Object.keys(value.string.bs.rate)) {
            labels.push(value.string.bs.rate[key]);
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
    },
    update(stats) {
        const data = [];
        for (const rate of Object.keys(value.string.bs.rate)) {
            const avg = stats.rate[rate].reduce((pre, cur) => pre + cur, 0) / stats.rate[rate].length;
            data.push(parseFloat(avg.toFixed(2)));
        }
        this.chart.data.datasets[0].data = data;
        this.chart.update();
    },
    updateStyle() {
        if (!this.chart) return;
        const style = getComputedStyle(document.documentElement);
        this.chart.data.datasets[0].borderColor = style.getPropertyValue('--mdc-theme-primary');
        this.chart.data.datasets[0].hoverBorderColor = style.getPropertyValue('--mdc-theme-primary');
        this.chart.options.scale.angleLines.color = style.getPropertyValue('--mdc-theme-text-disabled-on-light');
        this.chart.options.scale.gridLines.color = style.getPropertyValue('--mdc-theme-text-disabled-on-light');
        this.chart.update();
    },
    setVisible(visible) { this.root.hidden = !visible; },
};
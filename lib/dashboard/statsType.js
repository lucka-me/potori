dashboard.card.statsType = {
    root: null,
    chart: null,
    init() {
        const canvasChart = eliKit.build('canvas', { className: 'canvas-chart--v' });
        this.root = eliKit.chartCard('Stats: Type', canvasChart, 2, 250);
        this.setVisible(false);
        document.querySelector('#dashboard').appendChild(this.root);

        const labels = [];
        const colors = [];
        const colorsLight = [];
        const colorsDark = [];
        const style = getComputedStyle(document.documentElement);
        for (const key of Object.keys(value.data.type)) {
            labels.push(value.data.type[key].title);
            colors.push(style.getPropertyValue(`--color-${key}`));
            colorsLight.push(style.getPropertyValue(`--color-${key}--light`));
            colorsDark.push(style.getPropertyValue(`--color-${key}--dark`));
        }
        this.chart = new Chart(canvasChart.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: [],
                    backgroundColor: colors,
                    borderAlign: 'inner',
                    borderColor: value.string.chart.color.border,
                    hoverBackgroundColor: colors,
                    hoverBorderColor: value.string.chart.color.borderHover,
                }]
            },
            options: {
                legend: { display: true, position: 'right', },
                tooltips: {
                    callbacks: { label: toolkit.tooltipsLabelCallback, },
                },
            }
        });
    },
    update() {
        const data = new Array(3).fill(0);
        for (const portal of process.portals) {
            if (portal.status > 100) {
                data[2] += 1;
            } else {
                data[portal.status] += 1;
            }
        }
        this.chart.data.datasets[0].data = data;
        this.chart.update();
    },
    updateStyle() { },
    setVisible(visible) { this.root.hidden = !visible; },
};
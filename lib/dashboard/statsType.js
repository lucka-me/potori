dashboard.card.statsType = {
    chart: null,
    init: () => {
        const context = document.querySelector('#card-stats-type canvas').getContext('2d');
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
        dashboard.card.statsType.chart = new Chart(context, {
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
                maintainAspectRatio: false,
                tooltips: {
                    callbacks: { label: toolkit.tooltipsLabelCallback, },
                },
            }
        });
    },
    update: () => {
        const data = new Array(3).fill(0);
        for (const portal of process.portals) {
            if (portal.status > 100) {
                data[2] += 1;
            } else {
                data[portal.status] += 1;
            }
        }
        dashboard.card.statsType.chart.data.datasets[0].data = data;
        dashboard.card.statsType.chart.update();
    },
    updateStyle: () => { },
    setVisible: (visible) => document.querySelector('#card-stats-type').hidden = !visible,
};
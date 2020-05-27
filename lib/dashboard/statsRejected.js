dashboard.card.statsRejected = {
    chart: null,
    init: () => {
        const context = document.querySelector('#card-stats-rejected canvas').getContext('2d');
        const labels = [];
        const colors = [];
        for (const key of Object.keys(value.data.reason)) {
            labels.push(value.data.reason[key].title);
            colors.push(value.data.reason[key].color)
        }
        dashboard.card.statsRejected.chart = new Chart(context, {
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
                }],
            },
            options: {
                legend: { display: true, position: 'right', },
                maintainAspectRatio: false,
                tooltips: {
                    callbacks: { label: toolkit.tooltipsLabelCallback, },
                },
            },
        });
    },
    update: () => {
        const data = new Array(Object.keys(value.data.reason).length).fill(0);
        for (const portal of process.portals) {
            if (portal.status > 100) {
                data[portal.status - 101] += 1;
            }
        }
        dashboard.card.statsRejected.chart.data.datasets[0].data = data;
        dashboard.card.statsRejected.chart.update();
    },
    updateStyle: () => { },
    setVisible: (visible) => document.querySelector('#card-stats-rejected').hidden = !visible,
};
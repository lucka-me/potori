dashboard.card.quotas = {
    chart: null,
    init: () => {
        const context = document.querySelector('#card-quotas canvas').getContext('2d');
        const labels = [];
        for (let i = 1; i < 15; i++) {
            labels.push(`${i}`);
        }
        const style = getComputedStyle(document.documentElement);
        dashboard.card.quotas.chart = new Chart(context, {
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
    setVisible: (visible) => document.querySelector('#card-quotas').hidden = !visible,
};
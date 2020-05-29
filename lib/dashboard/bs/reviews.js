dashboard.card.bs.card.reviews = {
    chart: null,
    init: () => {
        const context = document.querySelector('#card-bs-reviews canvas').getContext('2d');
        const style = getComputedStyle(document.documentElement);
        dashboard.card.bs.card.reviews.chart = new Chart(context, {
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
    update: (stats) => {
        const chart = dashboard.card.bs.card.reviews.chart;
        if (stats.reviewTimes.length < 1) {
            chart.data.datasets[0].data = [];
            chart.update();
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
        chart.data.datasets[0].data = dataTimes;
        chart.update();
    },
    updateStyle: () => {
        const chart = dashboard.card.bs.card.reviews.chart;
        if (!chart) return;
        const style = getComputedStyle(document.documentElement);
        chart.data.datasets[0].borderColor = style.getPropertyValue('--mdc-theme-primary');
        chart.data.datasets[0].hoverBorderColor = style.getPropertyValue('--mdc-theme-primary');
        chart.update();
    },
    setVisible: (visible) => document.querySelector('#card-bs-reviews').hidden = !visible,
};
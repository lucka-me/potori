dashboard.card.bs.card.rates = {
    chart: null,
    init: () => {
        const card = dashboard.card.bs.card.rates;
        const context = document.querySelector('#card-bs-rates canvas').getContext('2d');
        const labels = [];
        for (const key of Object.keys(value.string.bs.rate)) {
            labels.push(value.string.bs.rate[key]);
        }
        const style = getComputedStyle(document.documentElement);
        card.chart = new Chart(context, {
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
                maintainAspectRatio: false,
            },
        });
    },
    update: (stats) => {
        const data = [];
        for (const rate of Object.keys(value.string.bs.rate)) {
            const avg = stats.rate[rate].reduce((pre, cur) => pre + cur, 0) / stats.rate[rate].length;
            data.push(parseFloat(avg.toFixed(2)));
        }
        const card = dashboard.card.bs.card.rates;
        card.chart.data.datasets[0].data = data;
        card.chart.update();
    },
    updateStyle: () => {
        const chart = dashboard.card.bs.card.rates.chart;
        if (!chart) return;
        const style = getComputedStyle(document.documentElement);
        chart.options.scale.angleLines.color = style.getPropertyValue('--mdc-theme-text-disabled-on-light');
        chart.options.scale.gridLines.color = style.getPropertyValue('--mdc-theme-text-disabled-on-light');
    },
    setVisible: (visible) => document.querySelector('#card-bs-rates').hidden = !visible,
};
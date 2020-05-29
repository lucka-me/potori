dashboard.card.countMonth = {
    chart: null,
    init: () => {
        const context = document.querySelector('#card-count-month canvas').getContext('2d');
        const style = getComputedStyle(document.documentElement);
        dashboard.card.countMonth.chart = new Chart(context, {
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
                maintainAspectRatio: false,
            }
        });
    },
    update: () => {
        const chart = dashboard.card.countMonth.chart;
        if (process.portals.length === 0) {
            chart.data.datasets[0].data = [];
            chart.data.datasets[1].data = [];
            chart.update();
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
        chart.data.datasets[0].data = dataSub;
        chart.data.datasets[1].data = dataRet;
        chart.update();
    },
    updateStyle: () => {
        const chart = dashboard.card.countMonth.chart;
        if (!chart) return;
        const style = getComputedStyle(document.documentElement);
        chart.data.datasets[0].borderColor = style.getPropertyValue('--mdc-theme-primary');
        chart.data.datasets[0].hoverBorderColor = style.getPropertyValue('--mdc-theme-primary');
        chart.data.datasets[1].borderColor = style.getPropertyValue('--mdc-theme-secondary');
        chart.data.datasets[1].hoverBorderColor = style.getPropertyValue('--mdc-theme-secondary');
    },
    setVisible: (visible) => document.querySelector('#card-count-month').hidden = !visible,
};
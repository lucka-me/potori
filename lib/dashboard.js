const dashboard = {
    card: {
        map: {
            init: () => mapKit.load(),
            update: () => mapKit.updateData(),
            updateStyle: (dark) => { },
            setVisible: (visible) => visible,
        },
        filter: {
            block: {
                type:   document.getElementById('block-card-filter-type'),
                reason: document.getElementById('block-card-filter-reason'),
            },
            type: { },
            reason: { },
            init: () => {
                const card = dashboard.card.filter;
                const createSwitch = (block, key, type) => {
                    const switchId = `switch-filter-${block}-${key}`;
                    const switchBox = document.getElementById('template-switchBox').content.cloneNode(true);
                    const switchElement = switchBox.querySelector('.mdc-switch');
                    switchElement.id = switchId;
                    const switchLabel = switchBox.querySelector('label');
                    switchLabel.className = `material-icons status-${type}`;
                    switchLabel.for = switchId;
                    switchLabel.title = value.data[block][key].title;
                    switchLabel.innerHTML = value.data[block][key].icon;
                    card.block[block].appendChild(switchBox);
                    card[block][key] = new mdc.switchControl.MDCSwitch(switchElement);
                    return card[block][key];
                };
                for (const key of Object.keys(value.data.reason)) {
                    const switchCtrl = createSwitch('reason', key, 'rejected');
                    switchCtrl.listen('change', (_) => {
                        card.switchRejecteReason(key);
                    });
                }
                for (const key of Object.keys(value.data.type)) {
                    const switchCtrl = createSwitch('type', key, key,);
                    switchCtrl.listen(
                        'change',
                        (_) => {
                            card.switchType(key);
                            if (key === 'rejected') {
                                for (const key of Object.keys(card.reason)) {
                                    card.reason[key].checked =
                                    card.type.rejected.checked;
                                }
                                mapKit.updateRejectedData();
                            }
                        }
                    );
                }
            },
            update: () => { },
            updateStyle: () => { },
            setVisible: (visible) => document.querySelector('#card-filter').hidden = !visible,
            switchType: (type) => {
                const filter = dashboard.card.filter.type[type];
                const hidden = !filter.checked;
                const code = value.data.type[type].code;
                for (const portal of process.portals) {
                    if (toolkit.typeMatched(portal.status, code)) {
                        document.getElementById(`card-${portal.id}`).hidden = hidden;
                    }
                }
                mapKit.setVisible(type, filter.checked);
            },
            switchRejecteReason: (reason) => {
                const filter = dashboard.card.filter.reason[reason];
                const hidden = !filter.checked;
                for (const portal of process.portals) {
                    if (portal.status !== value.data.reason[reason].code) continue;
                    document.getElementById(`card-${portal.id}`).hidden = hidden;
                }
                mapKit.updateRejectedData();
                if (!hidden && !dashboard.card.filter.type.rejected.checked) {
                    dashboard.card.filter.type.rejected.checked = true;
                    mapKit.setVisible('rejected', true);
                }
            },
        },
        statsType: {
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
                        legend: { display: false, },
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
        },
        statsRejected: {
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
        },
        countMonth: {
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
                        tooltips: { mode: 'index', },
                        maintainAspectRatio: false,
                    }
                });
            },
            update: () => {
                if (process.portals.length === 0) {
                    dashboard.card.countMonth.chart.data.datasets[0].data = [];
                    dashboard.card.countMonth.chart.data.datasets[1].data = [];
                    dashboard.card.countMonth.chart.update();
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
                for (const [key, value] of mapSub) {
                    dataSub.push({ t: key, y: value, });
                };
                for (const [key, value] of mapRet) {
                    dataRet.push({ t: key, y: value, });
                };
                dataSub.sort((a, b) => a.t - b.t);
                dataRet.sort((a, b) => a.t - b.t);
                dashboard.card.countMonth.chart.data.datasets[0].data = dataSub;
                dashboard.card.countMonth.chart.data.datasets[1].data = dataRet;
                dashboard.card.countMonth.chart.update();
            },
            updateStyle: () => { },
            setVisible: (visible) => document.querySelector('#card-count-month').hidden = !visible,
        },
        quotas: {
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
                        }],
                    },
                    options: {
                        legend: {
                            display: false,
                        },
                        scales: {
                            yAxes: [{
                                ticks: { beginAtZero: true, },
                            }],
                            xAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Day'
                                },
                            }],
                        },
                        maintainAspectRatio: false,
                    }
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
                dashboard.card.quotas.chart.data.datasets[0].data = data;
                dashboard.card.quotas.chart.update();
            },
            updateStyle: () => { },
            setVisible: (visible) => document.querySelector('#card-quotas').hidden = !visible,
        },
        bs: {
            card: {
                basic: {
                    textCount: null,
                    textAvg: null,
                    init: () => {
                        const card = dashboard.card.bs.card.basic;
                        const cardElement = document.getElementById('card-bs-basic');
                        const contentElement = cardElement.querySelector('.flex-box-col');

                        card.textCount = document.createElement('span');
                        card.textAvg = document.createElement('span');

                        contentElement.appendChild(card.textCount);
                        contentElement.appendChild(card.textAvg);

                        const buttonUpdate = new mdc.ripple.MDCRipple(cardElement.querySelector('button'));
                        buttonUpdate.unbounded = true;
                        buttonUpdate.listen('click', card.onUpdate);
                    },
                    update: (stats) => {
                        const card = dashboard.card.bs.card.basic;
                        card.textCount.innerHTML = `${stats.review} Reviews for ${stats.portal} Portals`;
                        const avg = stats.rate.total.reduce((pre, cur) => pre + cur, 0) / stats.rate.total.length;
                        card.textAvg.innerHTML = `Average Star: ${avg.toFixed(2)}`;
                    },
                    updateStyle: () => {

                    },
                    setVisible: (visible) => document.querySelector('#card-bs-basic').hidden = !visible,
                    onUpdate: () => process.updateBsData(),
                },
                rates: {
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
                                        min: 1,
                                        max: 5,
                                        stepSize: 1,
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
                            data.push(avg);
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
                }
            },
            
            init: () => {
                for (const card of Object.keys(dashboard.card.bs.card)) {
                    dashboard.card.bs.card[card].init();
                }
            },
            update: () => {
                const stats = {
                    review: 0, portal: 0,
                    rate: { total: [], }
                }
                for (const key of Object.keys(value.string.bs.rate)) {
                    stats.rate[key] = [];
                }
                const statsRate = (rateJson, key) => {
                    if (rateJson[key]) stats.rate[key].push(parseInt(rateJson[key]));
                }
                for (const portal of process.portals) {
                    if (!bsKit.data.has(portal.id)) continue;
                    const bs = bsKit.data.get(portal.id);
                    let hasReview = false;
                    for (const key of Object.keys(bs)) {
                        if (!key.startsWith('review')) continue;
                        if (!bs[key].stars) continue;
                        hasReview = true;
                        stats.review += 1;
                        const starts = parseFloat(bs[key].stars);
                        if (!isNaN(starts)) {
                            stats.rate.total.push(parseFloat(bs[key].stars));
                        }
                        const rateJson = bs[key].JSON;
                        for (const rateKey of Object.keys(value.string.bs.rate)) {
                            statsRate(rateJson, rateKey);
                        }
                    }
                    if (hasReview) stats.portal += 1;
                }
                const card = dashboard.card.bs.card;
                card.basic.update(stats);
                card.rates.update(stats);
            },
            updateStyle: () => {
                for (const card of Object.keys(dashboard.card.bs.card)) {
                    dashboard.card.bs.card[card].updateStyle();
                }
            },
            setVisible: (visible) => {
                for (const card of Object.keys(dashboard.card.bs.card)) {
                    dashboard.card.bs.card[card].setVisible(visible);
                }
            },
        },
    },
    init() {
        Chart.defaults.global.legend.labels.boxWidth = 10;
        for (const card of Object.keys(dashboard.card)) {
            dashboard.card[card].init();
        }
    },
    hide: () => {
        for (const card of Object.keys(dashboard.card)) {
            dashboard.card[card].setVisible(false);
        }
    },
    show: () => {
        for (const card of Object.keys(dashboard.card)) {
            dashboard.card[card].setVisible(true);
        }
    },
    refresh: () => {
        for (const card of Object.keys(dashboard.card)) {
            dashboard.card[card].update();
        }
    },
    update: () => {
        dashboard.card.statsType.update();
        dashboard.card.statsRejected.update();
        dashboard.card.countMonth.update();
    },
    updateStyle: () => {
        for (const card of Object.keys(dashboard.card)) {
            dashboard.card[card].updateStyle();
        }
    }
};
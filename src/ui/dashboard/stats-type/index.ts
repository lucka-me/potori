import Chart from 'chart.js';
import { eli } from '@lucka-labs/eli';
import i18next from 'i18next';

import { base } from 'ui/dashboard/base';
import { umi } from 'service/umi';
import Nomination from 'service/nomination';

import './style.scss';

import { StringKey } from './constants';


class StatsTypeCard extends base.ChartCardProtorype {

    render() {
        const canvasChart = eli('canvas', { });
        this.root = base.eliChartCard('stats-type-card', i18next.t(StringKey.title), canvasChart);
        this.setVisible(false);
        this.parent.append(this.root);

        this.chart = new Chart(canvasChart.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [],
                    borderAlign: 'inner',
                    borderColor: 'rgba(0, 0, 0, 0.2)',
                    hoverBackgroundColor: [],
                    hoverBorderColor: 'rgba(0, 0, 0, 0.4)',
                }]
            },
            options: {
                legend: { display: true, position: 'right', },
            }
        });
    }

    update(nominations: Array<Nomination>) {

        const stats = new Map<string, number>();
        for (const type of umi.types.values()) {
            stats.set(type.key, 0);
        }
        nominations.reduce((map, nomination) => {
            const key = nomination.status.code > 100 ? 'rejected' : nomination.status.key;
            map.set(key, map.get(key) + 1);
            return map;
        }, stats);

        const labels = [];
        const colors = [];
        const data = [];
        const style = getComputedStyle(document.documentElement);
        for (const [key, count] of stats.entries()) {
            if (count < 1) continue;
            const type = umi.types.get(key);
            labels.push(i18next.t(type.title));
            colors.push(style.getPropertyValue(`--color-${key}`));
            data.push(count);
        }

        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        this.chart.data.datasets[0].backgroundColor = colors;
        this.chart.data.datasets[0].hoverBackgroundColor = colors;
        this.chart.update();
    }
}

export default StatsTypeCard;
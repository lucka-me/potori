import Chart from 'chart.js';
import i18next from 'i18next';

import { eli } from '@lucka-labs/eli';
import { base } from 'ui/dashboard/base';
import type Nomination from 'service/nomination';
import { umi } from 'service/umi';

import './style.scss';

import { StringKey } from './constants';

class StatsRejectedCard extends base.ChartCardProtorype {

    render() {
        const canvasChart = eli('canvas', { });
        this.root = base.eliChartCard('stats-rejected-card', i18next.t(StringKey.title), canvasChart);
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
                }],
            },
            options: {
                legend: { display: true, position: 'right', },
            },
        });
    }

    update(nominations: Array<Nomination>) {

        const stats = new Map<umi.StatusReason, number>();
        for (const reason of umi.reasons.values()) {
            stats.set(reason, 0);
        }
        nominations.reduce((map, nomination) => {
            if (nomination.status < 100) return map;
            const reason = umi.codes.get(nomination.status) as umi.StatusReason;
            map.set(reason, map.get(reason) + 1);
            return map;
        }, stats);

        const labels = [];
        const colors = [];
        const data = [];
        for (const [reason, count] of stats.entries()) {
            if (count < 1) continue;
            labels.push(i18next.t(reason.title));
            colors.push(reason.color);
            data.push(count);
        }

        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        this.chart.data.datasets[0].backgroundColor = colors;
        this.chart.data.datasets[0].hoverBackgroundColor = colors;
        this.chart.update();
    }
}

export default StatsRejectedCard;
import Chart from 'chart.js';
import { eli } from '@lucka-labs/eli';
import i18next from 'i18next';

import { base } from 'ui/dashboard/base';
import { umi } from 'service/umi';
import type Nomination from 'service/nomination';

import { StringKey } from './constants';

import './style.scss';

class StatsReasonsCard extends base.ChartCardProtorype {

    render() {
        const canvasChart = eli('canvas', { });
        this.root = base.eliChartCard('stats-reasons-card', i18next.t(StringKey.title), canvasChart);
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

        const stats = new Map<umi.ReasonCode, number>();
        for (const code of umi.reason.keys()) {
            stats.set(code, 0);
        }
        nominations.reduce((map, nomination) => {
            if (nomination.status !== umi.StatusCode.Rejected) return map;
            if (nomination.reasons.length > 0) {
                for (const code of nomination.reasons) {
                    map.set(code, map.get(code) + 1);
                }
            } else {
                const reason = umi.StatusReason.undeclared;
                map.set(reason, map.get(reason) + 1);
            }
            return map;
        }, stats);

        const labels = [];
        const colors = [];
        const data = [];
        for (const [code, count] of stats.entries()) {
            if (count < 1) continue;
            const reason = umi.reason.get(code);
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

export default StatsReasonsCard;
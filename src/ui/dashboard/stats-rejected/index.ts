import Chart from 'chart.js';
import i18next from 'i18next';

import { eli } from 'ui/eli';
import { service } from 'service';
import { DashboardChartProtorype } from 'ui/dashboard/base';
import Nomination from 'service/nomination';
import { StatusReason } from 'service/status';

import './style.scss';

class StatsRejectedCard extends DashboardChartProtorype {

    render() {
        const canvasChart = eli.build('canvas', { className: 'canvas-chart--v' });
        this.root = DashboardChartProtorype.buildChartCard(i18next.t('ui.dashboard.brainstorming.stats-rejected.title'), canvasChart, 3, 300);
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
                    borderColor: StatsRejectedCard.color.border,
                    hoverBackgroundColor: [],
                    hoverBorderColor: StatsRejectedCard.color.borderHover,
                }],
            },
            options: {
                legend: { display: true, position: 'right', },
            },
        });
    }

    update(nominations: Array<Nomination>) {

        const stats = new Map<StatusReason, number>();
        for (const reason of service.status.reasons.values()) {
            stats.set(reason, 0);
        }
        nominations.reduce((map, nomination) => {
            if (nomination.status.code < 100) return map;
            const reason = nomination.status as StatusReason;
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
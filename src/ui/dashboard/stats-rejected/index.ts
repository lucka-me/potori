import Chart from 'chart.js';

import { DashboardChartProtorype, Nomination, i18next, service } from '../base';

class StatsRejectedCard extends DashboardChartProtorype {

    render() {
        const canvasChart = eli.build('canvas', { className: 'canvas-chart--v' });
        this.root = DashboardChartProtorype.buildChartCard(i18next.t('Stats Rejected'), canvasChart, 2, 250);
        this.setVisible(false);
        this.parent.append(this.root);

        const labels = [];
        const colors = [];

        for (const reason of service.status.reasons.values()) {
            labels.push(i18next.t(reason.title));
            colors.push(reason.color)
        }
        this.chart = new Chart(canvasChart.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: [],
                    backgroundColor: colors,
                    borderAlign: 'inner',
                    borderColor: StatsRejectedCard.color.border,
                    hoverBackgroundColor: colors,
                    hoverBorderColor: StatsRejectedCard.color.borderHover,
                }],
            },
            options: {
                legend: { display: true, position: 'right', },
            },
        });
    }

    update(nominations: Array<Nomination>) {
        const data = new Array(service.status.reasons.size).fill(0);
        for (const nomination of nominations) {
            if (nomination.status.code > 100) {
                data[nomination.status.code - 101] += 1;
            }
        }
        this.chart.data.datasets[0].data = data;
        this.chart.update();
    }
}

export default StatsRejectedCard;
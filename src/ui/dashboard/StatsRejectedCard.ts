import Chart from 'chart.js';

import { DashboardChartProtorype, Eli, Nomination, i18next } from './prototypes';
import StatusKit from '../../service/StatusKit';

class StatsRejectedCard extends DashboardChartProtorype {

    render() {
        const canvasChart = Eli.build('canvas', { className: 'canvas-chart--v' });
        this.root = Eli.chartCard(i18next.t('Stats Rejected'), canvasChart, 2, 250);
        this.setVisible(false);
        this.parent.append(this.root);

        const labels = [];
        const colors = [];

        for (const reason of StatusKit.reasons.values()) {
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
        const data = new Array(StatusKit.reasons.size).fill(0);
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
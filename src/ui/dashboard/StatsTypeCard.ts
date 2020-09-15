import Chart from 'chart.js';

import { DashboardChartProtorype, Eli, Nomination, i18next } from './prototypes';
import { statusKit } from '../../service';

class StatsTypeCard extends DashboardChartProtorype {

    render() {
        const canvasChart = Eli.build('canvas', { className: 'canvas-chart--v' });
        this.root = DashboardChartProtorype.buildChartCard(i18next.t('Stats Type'), canvasChart, 2, 250);
        this.setVisible(false);
        this.parent.append(this.root);

        const labels = [];
        const colors = [];
        const colorsLight = [];
        const colorsDark = [];
        const style = getComputedStyle(document.documentElement);
        
        for (const [key, value] of statusKit.types.entries()) {
            labels.push(i18next.t(value.title));
            colors.push(style.getPropertyValue(`--color-${key}`));
            colorsLight.push(style.getPropertyValue(`--color-${key}--light`));
            colorsDark.push(style.getPropertyValue(`--color-${key}--dark`));
        }
        this.chart = new Chart(canvasChart.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: [],
                    backgroundColor: colors,
                    borderAlign: 'inner',
                    borderColor: StatsTypeCard.color.border,
                    hoverBackgroundColor: colors,
                    hoverBorderColor: StatsTypeCard.color.borderHover,
                }]
            },
            options: {
                legend: { display: true, position: 'right', },
            }
        });
    }

    update(nominations: Array<Nomination>) {
        const data = new Array(3).fill(0);
        for (const nomination of nominations) {
            if (nomination.status.code > 100) {
                data[2] += 1;
            } else {
                data[nomination.status.code] += 1;
            }
        }
        this.chart.data.datasets[0].data = data;
        this.chart.update();
    }
}

export default StatsTypeCard;
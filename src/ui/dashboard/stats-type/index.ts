import Chart from 'chart.js';
import i18next from 'i18next';

import { eli } from 'ui/eli';
import { service } from 'service';
import { DashboardChartProtorype } from 'ui/dashboard/base';
import Nomination from 'service/nomination';

import './style.scss';

class StatsTypeCard extends DashboardChartProtorype {

    render() {
        const canvasChart = eli.build('canvas', { className: 'canvas-chart--v' });
        this.root = DashboardChartProtorype.buildChartCard(i18next.t('ui.dashboard.stats-type.title'), canvasChart, 2, 250);
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
        for (const type of service.status.types.values()) {
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
            const type = service.status.types.get(key);
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
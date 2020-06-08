import { DashboardChartProtorype } from './prototypes.js';
import Eli from "../Eli";
import Toolkit from "../Toolkit.js";
import StatusKit from '../../service/StatusKit';

class StatsRejectedCard extends DashboardChartProtorype {
    constructor() { super(); }

    init(parent) {
        const canvasChart = Eli.build('canvas', { className: 'canvas-chart--v' });
        this.root = Eli.chartCard('Stats: Rejected', canvasChart, 2, 250);
        this.setVisible(false);
        parent.appendChild(this.root);

        const labels = [];
        const colors = [];
        
        for (const reason of StatusKit.reasons.values()) {
            labels.push(reason.title);
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
                tooltips: {
                    callbacks: { label: Toolkit.tooltipsLabelCallback, },
                },
            },
        });
    }

    update(portals) {
        const data = new Array(StatusKit.reasons.size).fill(0);
        for (const portal of portals) {
            if (portal.status > 100) {
                data[portal.status - 101] += 1;
            }
        }
        this.chart.data.datasets[0].data = data;
        this.chart.update();
    }
}

export default StatsRejectedCard;
import { DashboardChartProtorype } from './prototypes.js';
import { Eli } from "../Eli.js";
import { Toolkit } from "../../toolkit.js";

class StatsRejectedCard extends DashboardChartProtorype {
    constructor() { super(); }

    init(parent) {
        const canvasChart = Eli.build('canvas', { className: 'canvas-chart--v' });
        this.root = Eli.chartCard('Stats: Rejected', canvasChart, 2, 250);
        this.setVisible(false);
        parent.appendChild(this.root);

        const labels = [];
        const colors = [];
        for (const key of Object.keys(value.data.reason)) {
            labels.push(value.data.reason[key].title);
            colors.push(value.data.reason[key].color)
        }
        this.chart = new Chart(canvasChart.getContext('2d'), {
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
                tooltips: {
                    callbacks: { label: Toolkit.tooltipsLabelCallback, },
                },
            },
        });
    }

    update() {
        const data = new Array(Object.keys(value.data.reason).length).fill(0);
        for (const portal of process.portals) {
            if (portal.status > 100) {
                data[portal.status - 101] += 1;
            }
        }
        this.chart.data.datasets[0].data = data;
        this.chart.update();
    }
}

export { StatsRejectedCard };
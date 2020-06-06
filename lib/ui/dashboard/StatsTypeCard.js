import { DashboardChartProtorype } from './prototypes.js';
import Eli from "../Eli.js";
import Toolkit from "../../Toolkit.js";
import StatusKit from '../../service/StatusKit.js';

class StatsTypeCard extends DashboardChartProtorype {
    constructor() { super(); }

    init(parent) {
        const canvasChart = Eli.build('canvas', { className: 'canvas-chart--v' });
        this.root = Eli.chartCard('Stats: Type', canvasChart, 2, 250);
        this.setVisible(false);
        parent.appendChild(this.root);

        const labels = [];
        const colors = [];
        const colorsLight = [];
        const colorsDark = [];
        const style = getComputedStyle(document.documentElement);
        
        for (const [key, value] of StatusKit.types.entries()) {
            labels.push(value.title);
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
                tooltips: {
                    callbacks: { label: Toolkit.tooltipsLabelCallback, },
                },
            }
        });
    }

    update(portals) {
        const data = new Array(3).fill(0);
        for (const portal of portals) {
            if (portal.status > 100) {
                data[2] += 1;
            } else {
                data[portal.status] += 1;
            }
        }
        this.chart.data.datasets[0].data = data;
        this.chart.update();
    }
}

export default StatsTypeCard;
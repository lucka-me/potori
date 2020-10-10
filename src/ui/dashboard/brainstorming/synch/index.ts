import i18next from 'i18next';

import { eli } from 'ui/eli';
import { BrainstormingStats } from 'service/brainstorming';
import { DashboardBsPrototype } from 'ui/dashboard/brainstorming/base';

import './style.scss';

class BSSynchCard extends DashboardBsPrototype {

    textSynch: HTMLSpanElement = null;

    render() {
        this.textSynch = eli.build('span', {
            cssText: 'font-weight:300;font-size:6rem;line-height:6rem;',
            innerHTML: '0.0',
        })
        this.root = eli.build('div', {
            className: [
                'mdc-card',
                'mdc-card--outlined',
                'padding--8',
                'flex--1',
                'flex-shrink--1',
                'flex-justify-content--between'
            ].join(' '),
        }, [
            eli.build('span', {
                className: 'mdc-typography--headline6',
                innerHTML: i18next.t('ui.dashboard.brainstorming.synch.title'),
            }),
            eli.build('span', { className: 'text-nowarp' }, [
                this.textSynch,
                eli.build('span', {
                    cssText: 'font-size:2rem;line-height:2rem;',
                    innerHTML: '%'
                }),
            ]),
            eli.build('span', {
                className: 'mdc-typography--body1 text-nowarp',
                innerHTML: i18next.t('ui.dashboard.brainstorming.synch.desc'),
            }),
        ]);
        this.setVisible(false);
        this.parent.append(this.root);
    }

    updateStats(stats: BrainstormingStats) {
        const rate = stats.synch.total > 0 ? stats.synch.synched / stats.synch.total : 0.0;
        this.textSynch.innerHTML = `${(rate * 100).toFixed(1)}`;
    }
}

export default BSSynchCard;
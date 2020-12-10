import i18next from 'i18next';

import { eli } from '@lucka-labs/eli';
import { eliCard } from 'eli/card';

import { BrainstormingStats } from 'service/brainstorming';
import { base } from 'ui/dashboard/brainstorming/base';

import './style.scss';

import { StringKey } from './constants';

class BSSynchCard extends base.ChartCardPrototype {

    render() {
        this.root = eliCard('bs-synch-card', [
            eli('div', { className: 'content' }, [
                eli('span', {
                    className: 'title',
                    innerHTML: i18next.t(StringKey.title),
                }),
                eli('span', { className: 'synch' }, [
                    eli('span', {
                        className: 'number',
                        innerHTML: '0.0',
                    }),
                    eli('span', {
                        className: 'percent',
                        innerHTML: '%'
                    }),
                ]),
                eli('span', {
                    className: 'desc',
                    innerHTML: i18next.t(StringKey.desc),
                })
            ]),
        ]);

        this.setVisible(false);
        this.parent.append(this.root);
    }

    updateStats(stats: BrainstormingStats) {
        const rate = stats.synch.total > 0 ? stats.synch.synched / stats.synch.total : 0.0;
        this.root.querySelector('.number').innerHTML = `${(rate * 100).toFixed(1)}`;
    }
}

export default BSSynchCard;
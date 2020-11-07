import i18next from 'i18next';
import { MDCRipple } from '@material/ripple';

import { eli } from 'eli/eli';
import { eliCard } from 'eli/card';
import { eliIcon } from 'eli/icon';

import { BrainstormingStats } from 'service/brainstorming';
import { base } from 'ui/dashboard/brainstorming/base';

import './style.scss';

import { StringKey } from './constants';

type BasicCallback = () => void;

interface BSBasicCardEvents {
    refresh:    BasicCallback,
    clear:      BasicCallback;
}

class BSBasicCard extends base.CardPrototype {

    private actionRefresh: HTMLButtonElement = null;

    events: BSBasicCardEvents = {
        refresh:    () => {},
        clear:      () => {},
    };

    render() {
        this.actionRefresh = eliCard.buttonAction(eliIcon.Icon.syncAlt, i18next.t(StringKey.refresh));
        const rippleRefresh = new MDCRipple(this.actionRefresh);
        rippleRefresh.unbounded = true;
        rippleRefresh.listen('click', () => {
            this.actionRefresh.disabled = true;
            this.events.refresh();
        });

        const actionClear = eliCard.iconAction(eliIcon.Icon.trash, i18next.t(StringKey.clear));
        const rippleClear = new MDCRipple(actionClear);
        rippleClear.unbounded = true;
        rippleClear.listen('click', () => {
            this.events.clear();
        });

        this.root = eliCard('bs-basic-card', [
            eli('div', { className: 'content' }, [
                eli('span', {
                    className: 'title',
                    innerHTML: i18next.t(StringKey.title),
                }),
                eli('span', {
                    className: 'count',
                    innerHTML: '0',
                }),
                eli('span', {
                    className: 'desc',
                    innerHTML: i18next.t(StringKey.desc, { count: 0 }),
                })
            ]),
            eliCard.actions({
                buttons: [],
                icons: [ actionClear ]
            })
        ]);

        this.setVisible(false);
        this.parent.append(this.root);
    }

    updateStats(stats: BrainstormingStats) {
        this.root.querySelector('.count').innerHTML = `${stats.review}`;
        this.root.querySelector('.desc').innerHTML = i18next.t(StringKey.desc, { count: stats.nomination });
        this.actionRefresh.disabled = false;
    }
}

export default BSBasicCard;
import i18next from 'i18next';
import { MDCRipple } from "@material/ripple";

import { eli } from 'ui/eli';
import { BrainstormingStats } from 'service/brainstorming';
import { DashboardBsPrototype } from 'ui/dashboard/brainstorming/base';

interface BSBasicCardEvents {
    refresh:    () => void,
    clear:      () => void;
}

class BSBasicCard extends DashboardBsPrototype {

    textReviews     : HTMLSpanElement   = null;
    textSubtitle    : HTMLSpanElement   = null;
    actionRefresh   : HTMLButtonElement = null;

    events: BSBasicCardEvents = {
        refresh:    () => {},
        clear:      () => {},
    };

    render() {
        this.textReviews = eli.build('span', {
            cssText: 'font-weight:300;font-size:4.5rem;line-height:4.5rem;',
            innerHTML: '0',
        });
        this.textSubtitle = eli.build('span', {
            className: 'mdc-typography--body1 text-nowrap',
            innerHTML: i18next.t('Reviews for Portals', { count: 0 }),
        });

        this.actionRefresh = eli.build('button', {
            className: 'mdc-button mdc-card__action mdc-card__action--button',
            disabled: true,
        }, [
            eli.build('div', { className: 'mdc-button__ripple' }),
            eli.build('i', { className: 'fa fa-fw mdc-button__icon', innerHTML: '\uf2f1' }),
            eli.build('span', { className: 'mdc-button__label', innerHTML: i18next.t('Refresh') }),
        ]);
        const rippleRefresh = new MDCRipple(this.actionRefresh);
        rippleRefresh.unbounded = true;
        rippleRefresh.listen('click', () => {
            this.actionRefresh.disabled = true;
            this.events.refresh();
        });

        const actionClear = eli.build('button', {
            className: [
                'fa',
                'mdc-icon-button',
                'mdc-card__action',
                'mdc-card__action--icon'
            ].join(' '),
            title: i18next.t('Clear'),
            id: 'button-card-nomination-location',
            innerHTML: '\uf1f8',
        });
        const rippleClear = new MDCRipple(actionClear);
        rippleClear.unbounded = true;
        rippleClear.listen('click', () => {
            this.events.clear();
        });

        this.root = eli.build('div', {
            className: [
                'mdc-card',
                'mdc-card--outlined',
                'flex--1',
                'flex-shrink--1'
            ].join(' '),
        }, [
            eli.build('div', {
                className: [
                    'flex-box-col',
                    'padding--8',
                    'flex-grow--1',
                    'flex-justify-content--between'
                ].join(' '),
            }, [
                eli.build('span', {
                    className: 'mdc-typography--headline6',
                    innerHTML: i18next.t('Brainstorming'),
                }),
                this.textReviews,
                this.textSubtitle,
            ]),
            eli.build('div', {
                className: 'mdc-card__actions',
            }, [
                eli.build('div', {
                    className: 'mdc-card__action-buttons',
                }, [ this.actionRefresh ]),
                eli.build('div', {
                    className: 'mdc-card__action-icons',
                }, [ actionClear ]),
            ]),
        ]);

        this.setVisible(false);
        this.parent.append(this.root);
    }

    updateStats(stats: BrainstormingStats) {
        this.textReviews.innerHTML = `${stats.review}`;
        this.textSubtitle.innerHTML = i18next.t('Reviews for Portals', { count: stats.nomination });
        this.actionRefresh.disabled = false;
    }
}

export default BSBasicCard;
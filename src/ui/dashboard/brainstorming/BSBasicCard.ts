import { MDCRipple } from "@material/ripple";

import { DashboardBsPrototype, BrainstormingStats, Eli, i18next } from './prototypes';

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
        this.textReviews = Eli.build('span', {
            cssText: 'font-weight:300;font-size:4.5rem;line-height:4.5rem;',
            innerHTML: '0',
        });
        this.textSubtitle = Eli.build('span', {
            className: 'mdc-typography--body1 text-nowrap',
            innerHTML: i18next.t('Reviews for Portals', { count: 0 }),
        });

        this.actionRefresh = Eli.build('button', {
            className: 'mdc-button mdc-card__action mdc-card__action--button',
            disabled: true,
        }, [
            Eli.build('div', { className: 'mdc-button__ripple' }),
            Eli.build('i', { className: 'far fa-fw mdc-button__icon', innerHTML: '\uf2f1' }),
            Eli.build('span', { className: 'mdc-button__label', innerHTML: i18next.t('Refresh') }),
        ]);
        const rippleRefresh = new MDCRipple(this.actionRefresh);
        rippleRefresh.unbounded = true;
        rippleRefresh.listen('click', () => {
            this.actionRefresh.disabled = true;
            this.events.refresh();
        });

        const actionClear = Eli.build('button', {
            className: [
                'far',
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

        this.root = Eli.build('div', {
            className: [
                'mdc-card',
                'mdc-card--outlined',
                'flex--1',
                'flex-shrink--1'
            ].join(' '),
        }, [
            Eli.build('div', {
                className: [
                    'flex-box-col',
                    'padding--8',
                    'flex-grow--1',
                    'flex-justify-content--between'
                ].join(' '),
            }, [
                Eli.build('span', {
                    className: 'mdc-typography--headline6',
                    innerHTML: i18next.t('Brainstorming'),
                }),
                this.textReviews,
                this.textSubtitle,
            ]),
            Eli.build('div', {
                className: 'mdc-card__actions',
            }, [
                Eli.build('div', {
                    className: 'mdc-card__action-buttons',
                }, [ this.actionRefresh ]),
                Eli.build('div', {
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
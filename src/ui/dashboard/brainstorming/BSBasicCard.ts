import { ripple } from "material-components-web";

import { DashboardBsPrototype, BrainstormingStats, Eli, i18next } from './prototypes';

class BSBasicCard extends DashboardBsPrototype {

    textReviews     : HTMLSpanElement   = null;
    textSubtitle    : HTMLSpanElement   = null;
    buttonRefresh   : HTMLButtonElement = null;

    events = {
        refresh: () => {},
    };

    render() {
        this.textReviews = Eli.build('span', {
            cssTest: 'font-weight:300;font-size:4.5rem;line-height:4.5rem;',
            innerHTML: '0',
        });
        this.textSubtitle = Eli.build('span', {
            className: 'mdc-typography--body1 text-nowrap',
            innerHTML: i18next.t('Reviews for Portals', { count: 0 }),
        });

        this.buttonRefresh = Eli.build('button', {
            className: 'mdc-button mdc-card__action mdc-card__action--button',
            disabled: true,
        }, [
            Eli.build('div', { className: 'mdc-button__ripple' }),
            Eli.build('i', { className: 'material-icons mdc-button__icon', innerHTML: 'refresh' }),
            Eli.build('span', { className: 'mdc-button__label', innerHTML: 'Refresh' }),
        ]);
        const rippleRefresh = new ripple.MDCRipple(this.buttonRefresh);
        rippleRefresh.unbounded = true;
        rippleRefresh.listen('click', () => {
            this.buttonRefresh.disabled = true;
            this.events.refresh();
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
                }, [ this.buttonRefresh ]),
            ]),
        ]);

        this.setVisible(false);
        this.parent.appendChild(this.root);
    }

    updateStats(stats: BrainstormingStats) {
        
        this.textReviews.innerHTML = `${stats.review}`;
        this.textSubtitle.innerHTML = i18next.t('Reviews for Portals', { count: stats.nomination });
        this.buttonRefresh.disabled = false;
    }
}

export default BSBasicCard;
import { MDCRipple } from "@material/ripple";

import { DashboardBsPrototype, BrainstormingStats } from './prototypes';
import Eli from "../../Eli";

class BSBasicCard extends DashboardBsPrototype {

    textReviews     : HTMLSpanElement   = null;
    textSubtitle    : HTMLSpanElement   = null;
    buttonRefresh   : HTMLButtonElement = null;

    events = {
        refresh: () => {},
    };

    constructor() {
        super();
    }

    init(parent: HTMLElement) {

        this.textReviews = Eli.build('span', {
            styleText: 'font-weight:300;font-size:4.5rem;line-height:4.5rem;',
            innerHTML: '0',
        });
        this.textSubtitle = Eli.build('span', {
            className: 'mdc-typography--body1 text-nowrap',
            innerHTML: 'Review for 0 Portal',
        });

        this.buttonRefresh = Eli.build('button', {
            className: 'mdc-button mdc-card__action mdc-card__action--button',
            disabled: true,
            children: [
                Eli.build('div', { className: 'mdc-button__ripple' }),
                Eli.build('i', { className: 'material-icons mdc-button__icon', innerHTML: 'refresh' }),
                Eli.build('span', { className: 'mdc-button__label', innerHTML: 'Refresh' }),
            ],
        }) as HTMLButtonElement;
        const rippleRefresh = new MDCRipple(this.buttonRefresh);
        rippleRefresh.unbounded = true;
        rippleRefresh.listen('click', () => {
            this.buttonRefresh.disabled = true;
            this.events.refresh();
        });

        this.root = Eli.build('div', {
            className: 'mdc-card mdc-card--outlined flex--1 flex-shrink--1',
            children: [
                Eli.build('div', {
                    className: 'flex-box-col padding--8 flex-grow--1 flex-justify-content--between',
                    children: [
                        Eli.build('span', {
                            className: 'mdc-typography--headline6',
                            innerHTML: 'Brainstorming',
                        }),
                        this.textReviews,
                        this.textSubtitle,
                    ],
                }),
                Eli.build('div', {
                    className: 'mdc-card__actions',
                    children: [
                        Eli.build('div', {
                            className: 'mdc-card__action-buttons',
                            children: [ this.buttonRefresh ],
                        }),
                    ],
                }),
            ],
        });

        this.setVisible(false);
        parent.appendChild(this.root);
    }

    updateStats(stats: BrainstormingStats) {
        this.textReviews.innerHTML = `${stats.review}`;
        this.textSubtitle.innerHTML = [
            `${stats.review < 2 ? 'Review' : 'Reviews'} for `,
            `${stats.nomination} ${stats.nomination < 2 ? 'Portal' : 'Portals'}`
        ].join('');
        this.buttonRefresh.disabled = false;
    }
}

export default BSBasicCard;
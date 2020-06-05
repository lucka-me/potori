import { DashboardBsPrototype } from './Prototype.js';
import { Eli } from "../../Eli.js";

class BSBasicCard extends DashboardBsPrototype {
    constructor() {
        super();
        this.textReviews = null;
        this.textSubtitle = null;
        this.buttonRefresh = null;
    }

    init(parent) {

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
        });
        const rippleRefresh = new mdc.ripple.MDCRipple(this.buttonRefresh);
        rippleRefresh.unbounded = true;
        rippleRefresh.listen('click', () => {
            this.buttonRefresh.disabled = true;
            process.updateBsData();
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

    update(stats) {
        this.textReviews.innerHTML = `${stats.review}`;
        this.textSubtitle.innerHTML = `${stats.review < 2 ? 'Review' : 'Reviews'} for ${stats.portal} ${stats.portal < 2 ? 'Portal' : 'Portals'}`;
        this.buttonRefresh.disabled = false;
    }
}

export { BSBasicCard };
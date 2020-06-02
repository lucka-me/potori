dashboard.card.bs.card.basic = {
    root: null,
    textReviews: null,
    textSubtitle: null,
    init() {

        this.textReviews = eliKit.build('span', {
            styleText: 'font-weight:300;font-size:4.5rem;line-height:4.5rem;',
            innerHTML: '0',
        });
        this.textSubtitle = eliKit.build('span', {
            className: 'mdc-typography--body1 text-nowrap',
            innerHTML: 'Review for 0 Portal',
        });
        const buttonRefresh = eliKit.build('button', {
            className: 'mdc-button mdc-card__action mdc-card__action--button',
            children: [
                eliKit.build('div', { className: 'mdc-button__ripple' }),
                eliKit.build('i', { className: 'material-icons mdc-button__icon', innerHTML: 'refresh' }),
                eliKit.build('span', { className: 'mdc-button__label', innerHTML: 'Refresh' }),
            ],
        });
        this.root = eliKit.build('div', {
            className: 'mdc-card mdc-card--outlined flex--1 flex-shrink--1',
            children: [
                eliKit.build('div', {
                    className: 'flex-box-col padding--8 flex-grow--1 flex-justify-content--between',
                    children: [
                        eliKit.build('span', {
                            className: 'mdc-typography--headline6',
                            innerHTML: 'Brainstorming',
                        }),
                        this.textReviews,
                        this.textSubtitle,
                    ],
                }),
                eliKit.build('div', {
                    className: 'mdc-card__actions',
                    children: [
                        eliKit.build('div', {
                            className: 'mdc-card__action-buttons',
                            children: [ buttonRefresh ],
                        }),
                    ],
                }),
            ],
        });

        const rippleUpdate = new mdc.ripple.MDCRipple(buttonRefresh);
        rippleUpdate.unbounded = true;
        rippleUpdate.listen('click', () => process.updateBsData() );

        this.setVisible(false);
        document.querySelector('#dashboard').appendChild(this.root);
    },
    update(stats) {
        this.textReviews.innerHTML = `${stats.review}`;
        this.textSubtitle.innerHTML = `${stats.review < 2 ? 'Review' : 'Reviews'} for ${stats.portal} ${stats.portal < 2 ? 'Portal' : 'Portals'}`;
    },
    updateStyle() { },
    setVisible(visible) { this.root.hidden = !visible; },
};
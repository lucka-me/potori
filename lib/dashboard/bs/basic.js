dashboard.card.bs.card.basic = {
    textReviews: null,
    textSubtitle: null,
    init: () => {
        const card = dashboard.card.bs.card.basic;
        const cardElement = document.getElementById('card-bs-basic');
        const contentElement = cardElement.querySelector('.flex-box-col');

        card.textReviews = document.createElement('span');
        card.textReviews.className = 'stats-num';
        card.textReviews.innerHTML = '0';
        card.textSubtitle = document.createElement('span');
        card.textSubtitle.className = 'mdc-typography--subtitle1 text-nowrap';
        card.textSubtitle.innerHTML = 'Review for 0 Portal';

        contentElement.appendChild(card.textReviews);
        contentElement.appendChild(card.textSubtitle);

        const buttonUpdate = new mdc.ripple.MDCRipple(cardElement.querySelector('button'));
        buttonUpdate.unbounded = true;
        buttonUpdate.listen('click', card.onUpdate);
    },
    update: (stats) => {
        const card = dashboard.card.bs.card.basic;
        card.textReviews.innerHTML = `${stats.review}`;
        card.textSubtitle.innerHTML = `${stats.review < 2 ? 'Review' : 'Reviews'} for ${stats.portal} ${stats.portal < 2 ? 'Portal' : 'Portals'}`;
    },
    updateStyle: () => { },
    setVisible: (visible) => document.querySelector('#card-bs-basic').hidden = !visible,
    onUpdate: () => process.updateBsData(),
};
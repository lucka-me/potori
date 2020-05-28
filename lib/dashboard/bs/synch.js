dashboard.card.bs.card.synch = {
    textSynch: document.querySelector('#card-bs-synch .stats-num'),
    init: () => { },
    update: (stats) => {
        const card = dashboard.card.bs.card.synch;
        //const rate = stats.synch.matched / stats.synch.total;
        const rate = stats.synched / stats.review;
        card.textSynch.innerHTML = `${(rate * 100).toFixed(1)}`;
    },
    updateStyle: () => { },
    setVisible: (visible) => document.querySelector('#card-bs-synch').hidden = !visible,
}
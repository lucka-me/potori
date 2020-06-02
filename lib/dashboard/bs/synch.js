dashboard.card.bs.card.synch = {
    root: null,
    textSynch: null,
    init() {
        this.textSynch = eliKit.build('span', {
            styleText: 'font-weight:300;font-size:6rem;line-height:6rem;',
            innerHTML: '0.0',
        })
        this.root = eliKit.build('div', {
            className: 'mdc-card mdc-card--outlined padding--8 flex--1 flex-shrink--1 flex-justify-content--between',
            children: [
                eliKit.build('span', {
                    className: 'mdc-typography--headline6',
                    innerHTML: 'Brainstorming Synch',
                }),
                eliKit.build('span', {
                    className: 'text-nowarp',
                    children: [
                        this.textSynch,
                        eliKit.build('span', {
                            styleText: 'font-size:2rem;line-height:2rem;',
                            innerHTML: '%'
                        }),
                    ],
                }),
                eliKit.build('span', {
                    className: 'mdc-typography--body1 text-nowarp',
                    innerHTML: 'Reviews match the result',
                }),
            ],
        });
        this.setVisible(false);
        document.querySelector('#dashboard').appendChild(this.root);
    },
    update(stats) {
        const rate = stats.synch.synched / stats.synch.total;
        this.textSynch.innerHTML = `${(rate * 100).toFixed(1)}`;
    },
    updateStyle() { },
    setVisible(visible) { this.root.hidden = !visible; },
}
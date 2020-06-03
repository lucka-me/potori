dashboard.card.map = {
    init() {
        const root = eliKit.build('div', {
            className: 'mdc-card mdc-card--outlined flex--3 flex-shrink--1',
            styleText: 'min-width: 300px;',
            children: [ eliKit.build('div', { id: 'map-card-map' }) ],
        });
        document.querySelector('#dashboard').appendChild(root);
        mapKit.load();
    },
    update() {
        mapKit.updateData();
    },
    updateStyle() { },
    setVisible(_) { },
};
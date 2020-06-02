dashboard.card.map = {
    init() {
        mapKit.load();
    },
    update() {
        mapKit.updateData()
    },
    updateStyle() { },
    setVisible(_) {
        if (mapKit.ctrl) mapKit.ctrl.resize();
    },
};
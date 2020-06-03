const DialogPrototype = {
    ctrl: null,
    init() { },
    open() { },
};

const dialog = {
    about: DialogPrototype,
    alert: DialogPrototype,
    details: DialogPrototype,
    import: DialogPrototype,
};

const dialogCtrl = {
    init() {
        for (const key of Object.keys(dialog)) {
            dialog[key].init();
        }
    },
};
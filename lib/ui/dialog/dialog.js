const DialogPrototype = {
    ctrl: null,
    init(parent) { parent },
    open() { },
};

const dialog = {
    about: DialogPrototype,
    alert: DialogPrototype,
    details: DialogPrototype,
    import: DialogPrototype,
};
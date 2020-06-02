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
    init() {
        dialog.about.init();
        dialog.alert.init();
        dialog.import.init();

        dialog.details.ctrl.listen('MDCDialog:opened', dialog.details.onOpened);
        dialog.details.ctrl.listen('MDCDialog:closed', dialog.details.onClosed);
    },
};
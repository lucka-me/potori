ui.dialogKit = {
    init() {
        for (const key of Object.keys(dialog)) {
            dialog[key].init();
        }
    },
};
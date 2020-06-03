ui.dialogKit = {
    init(parent) {
        for (const key of Object.keys(dialog)) {
            dialog[key].init(parent);
        }
    },
};
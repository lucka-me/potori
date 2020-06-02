dialog.alert = {
    ctrl: null,
    textMessage: null,
    init() {
        this.textMessage = eliKit.build('div', {
            className: 'mdc-dialog__content',
        });
        const element = eliKit.dialog([
            this.textMessage,
            eliKit.build('footer', {
                className: 'mdc-dialog__actions',
                children: [ eliKit.dialogAction('close', 'Close') ],
            }),
        ]);
        document.body.appendChild(element);
        this.ctrl = new mdc.dialog.MDCDialog(element);
    },
    open(message) {
        this.ctrl.open();
        this.textMessage.innerHTML = message;
    },
};
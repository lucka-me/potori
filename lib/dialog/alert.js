dialog.alert = {
    ctrl: null,
    textMessage: null,
    init() {
        this.textMessage = eliKit.build('div', {
            className: 'mdc-dialog__content',
        });
        const buttonClose = eliKit.build('button', {
            className: 'mdc-button mdc-dialog__button',
            dataset: {
                mdcDialogAction: 'close',
                mdcDialogInitialFocus: ''
            },
            children: [
                eliKit.build('span', {
                    className: 'mdc-button__label', innerHTML: 'Close'
                }),
            ],
        });
        const element = eliKit.dialog([
            this.textMessage,
            eliKit.build('footer', {
                className: 'mdc-dialog__actions',
                children: [ buttonClose ],
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
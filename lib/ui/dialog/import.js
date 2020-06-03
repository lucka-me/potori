dialog.import = {
    ctrl: null,
    textField: null,
    init(parent) {
        const elementTextField = eliKit.build('div', {
            className: 'mdc-text-field mdc-text-field--outlined mdc-text-field--textarea mdc-text-field--fullwidth',
            children: [
                eliKit.build('textarea', {
                    className: 'mdc-text-field__input code',
                    id: 'input-dialog-import-wayfarer',
                    rows: 8, cols: 80
                }),
                eliKit.build('div', {
                    className: 'mdc-notched-outline',
                    children: [
                        eliKit.build('div', { className: 'mdc-notched-outline__leading' }),
                        eliKit.build('div', {
                            className: 'mdc-notched-outline__notch',
                            children: [
                                eliKit.build('label', {
                                    className: 'mdc-floating-label',
                                    for: 'input-dialog-import-wayfarer',
                                    innerHTML: 'JSON',
                                }),
                            ],
                        }),
                        eliKit.build('div', { className: 'mdc-notched-outline__trailing' }),
                    ],
                }),
            ],
        });
        const contents = [
            elementTextField,
            eliKit.build('div', {
                className: 'mdc-text-field-helper-line',
                children: [
                    eliKit.build('div', {
                        className: 'mdc-text-field-helper-text mdc-text-field-helper-text--persistent',
                        children: [
                            eliKit.text('From '),
                            eliKit.link(
                                'https://wayfarer.nianticlabs.com/api/v1/vault/manage',
                                'Wayfarer API', 'Wayfarer API'
                            ),
                        ],
                    }),
                ],
            }),
        ];
        const elementDialog = eliKit.dialog([
            eliKit.build('h2', {
                className: 'mdc-dialog__title',
                innerHTML: 'Import'
            }),
            eliKit.build('div', {
                className: 'mdc-dialog__content',
                children: contents,
            }),
            eliKit.build('footer', {
                className: 'mdc-dialog__actions',
                children: [
                    eliKit.dialogAction('close' , 'Close' ),
                    eliKit.dialogAction('import', 'Import'),
                ],
            }),
        ]);
        parent.appendChild(elementDialog);
        this.ctrl = new mdc.dialog.MDCDialog(elementDialog);
        this.textField = new mdc.textField.MDCTextField(elementTextField);
        this.ctrl.listen('MDCDialog:closed', (event) => this.closed(event));
    },
    open() { this.ctrl.open(); },
    closed(event) {
        if (event.detail.action === 'import') {
            process.import(this.textField.value);
        }
    },
}
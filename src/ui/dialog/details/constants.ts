const StringKeyBase = 'ui.dialog.match';

export const Action = {
    close: 'close',
    save: 'save',
}

export const ClassName = {
    textField: [
        'mdc-text-field',
        'mdc-text-field--outlined',
        'mdc-text-field--with-leading-icon',
        name,
    ].join(' '),
    textFieldIcon: [
        'fa',
        'mdc-text-field__icon',
        'mdc-text-field__icon--leading'
    ].join(' '),
}

export const Icon = {
    arrowUp: '\uf062',
    calendarAlt: '\uf073',
    angleDown: '\uf107',
    angleUp: '\uf106',
};

export const StringKey = {
    resultTime: `${StringKeyBase}.resultTime`,
    reason: `${StringKeyBase}.reason`,
    save: `${StringKeyBase}.save`,

    messageInvalidTime: `message:${StringKeyBase}.invalidTime`
};
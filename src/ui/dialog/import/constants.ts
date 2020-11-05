const StringKeyBase = 'ui.dialog.import';

export const Action = {
    import: 'import',
};

export const ClassName = {
    textfield: [
        'mdc-text-field',
        'mdc-text-field--outlined',
        'mdc-text-field--textarea',
        'mdc-text-field--fullwidth'
    ].join(' '),
};

export const Link = {
    wayfarer: 'https://wayfarer.nianticlabs.com/api/v1/vault/manage',
};

export const StringKey = {
    title: `${StringKeyBase}.title`,
    json: `${StringKeyBase}.json`,
    from: `${StringKeyBase}.from`,
    wayfarer: `${StringKeyBase}.wayfarer`,
    import: `${StringKeyBase}.import`,
};
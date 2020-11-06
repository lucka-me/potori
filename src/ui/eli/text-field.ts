import { eli } from './eli';

const ClassName = {
    textfieldTextarea: [
        'mdc-text-field',
        'mdc-text-field--outlined',
        'mdc-text-field--textarea',
        'mdc-text-field--fullwidth'
    ].join(' '),
    input: 'mdc-text-field__input',
    outline: 'mdc-notched-outline',
    outlineLeading: 'mdc-notched-outline__leading',
    outlineNotch: 'mdc-notched-outline__notch',
    label: 'mdc-floating-label',
    outlineTrailing: 'mdc-notched-outline__trailing',

    helper: 'mdc-text-field-helper-line',
    helperText: 'mdc-text-field-helper-text mdc-text-field-helper-text--persistent',
};

interface EliTextFieldOptions {
    id: string,
    label: string,
    textarea?: boolean,
}

export function eliTextField(options: EliTextFieldOptions): HTMLDivElement {
    return eli('div', {
        className: ClassName.textfieldTextarea,
    }, [
        eli('textarea', {
            className: ClassName.input,
            id: options.id,
            rows: 8, cols: 80
        }),
        eli('div', {
            className: ClassName.outline,
        }, [
            eli('div', { className: ClassName.outlineLeading }),
            eli('div', {
                className: ClassName.outlineNotch,
            }, [
                eli('label', {
                    className: ClassName.label,
                    for: options.id,
                    innerHTML: options.label,
                }),
            ]),
            eli('div', { className: ClassName.outlineTrailing }),
        ]),
    ]);
}

export namespace eliTextField {
    export function helper(contents: Array<HTMLElement>) {
        return eli('div', {
            className: ClassName.helper,
        }, [
            eli('div', {
                className: ClassName.helperText,
            }, contents),
        ]);
    }
}
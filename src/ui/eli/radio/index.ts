import { eli } from '@lucka-labs/eli';

import './style.scss';

const ClassName = {
    radio: 'mdc-radio',
    control: 'mdc-radio__native-control',
    background: 'mdc-radio__background',
    outerCircle: 'mdc-radio__outer-circle',
    innerCircle: 'mdc-radio__inner-circle'
};

type OnChangeEvent = (value: string) => void;

export function eliRadio(
    id: string, name: string, value: string, onchange: OnChangeEvent
): HTMLDivElement {
    const input = eli('input', {
        type: 'radio',
        className: ClassName.control,
        id: id,
        name: name,
        value: value,
    });
    input.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        onchange(target.value);
    })
    return eli('div', {
        className: ClassName.radio,
    }, [
        input,
        eli('div', {
            className: ClassName.background,
        }, [
            eli('div', { className: ClassName.outerCircle }),
            eli('div', { className: ClassName.innerCircle }),
        ]),
    ]);
}

export namespace eliRadio {
    export function form(input: HTMLElement, label: string, forId: string, labelClassName?: string) {
        return eli('div', {
            className: 'mdc-form-field',
        }, [
            input,
            eli('label', {
                for: forId,
                className: labelClassName || '',
                innerHTML: label,
            }),
        ]);
    }
}
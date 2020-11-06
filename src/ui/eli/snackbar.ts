import { eli } from './eli';

const ClassName = {
    snackbar: 'mdc-snackbar',
    surface: 'mdc-snackbar__surface',
    label: 'mdc-snackbar__label',
};

export function eliSnackbar() {
    return eli('div', { className: ClassName.snackbar }, [
        eli('div', { className: ClassName.surface }, [
            eli('div', {
                className: ClassName.label,
                role: 'status',
                ariaLive: 'polite',
            }),
        ]),
    ]);
}
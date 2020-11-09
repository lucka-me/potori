import { eli } from './eli';
import { eliIcon } from './icon';

const ClassName = {
    snackbar: 'mdc-snackbar',
    surface: 'mdc-snackbar__surface',
    label: 'mdc-snackbar__label',
    actions: 'mdc-snackbar__actions',
    dismiss: 'mdc-snackbar__dismiss mdc-icon-button fa',
};

export function eliSnackbar() {
    return eli('div', { className: ClassName.snackbar }, [
        eli('div', {
            className: ClassName.surface,
            role: 'status',
            ariaRelevant: 'additions',
        }, [
            eli('div', { className: ClassName.label }),
            eli('div', {
                className: ClassName.actions,
            }, [
                eli('button', {
                    className: ClassName.dismiss,
                    innerHTML: eliIcon.Icon.times
                })
            ])
        ]),
    ]);
}
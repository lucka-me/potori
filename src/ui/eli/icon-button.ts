import { eli } from './eli';

export function eliIconButton(icon: string) {
    return eli('button', {
        className: 'fa mdc-icon-button',
        innerHTML: icon,
    });
}
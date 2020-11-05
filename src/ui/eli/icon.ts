import { eli } from './eli';

export function eliIcon(icon: string): HTMLElement {
    return eli('i', {
        className: 'fa fa-fw',
        innerHTML: icon,
    });
}

export namespace eliIcon {
    export const Icon = {
        search: '\uf002',
        times:  '\uf00d',
        clock:  '\uf017',
        edit:   '\uf044',
        arrowUp:    '\uf062',
        plus:   '\uf067',
        calendarAlt:    '\uf073',
        globe:  '\uf0ac',
        angleUp:    '\uf106',
        angleDown:  '\uf107',
        trash:  '\uf1f8',
        redoAlt:    '\uf2f9',
        mapMarkerAlt:   '\uf3c5',
        brain:  '\uf5dc',
    };
}
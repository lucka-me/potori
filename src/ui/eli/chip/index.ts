import { eli } from '@lucka-labs/eli';
import { eliSVG } from 'eli/svg';

import './style.scss';

const ClassName = {
    chip: 'mdc-chip',
    ripple: 'mdc-chip__ripple',
    checkmark: 'mdc-chip__checkmark',
    chechmarkSVG: 'mdc-chip__checkmark-svg',
    chechmarkPath: 'mdc-chip__checkmark-path',
    primaryAction: 'mdc-chip__primary-action',
    text: 'mdc-chip__text',

    chipSet: 'mdc-chip-set mdc-chip-set--filter',
};

interface EliChipItem {
    id: string,
    text: string
}

export function eliChipSet(items: Array<EliChipItem>): HTMLDivElement {
    return eli(
        'div', 
        {
            className: ClassName.chipSet,
            role: 'grid'
        },
        items.map((item) => eli('div', {
            className: ClassName.chip,
            id: item.id,
            role: 'row',
        }, [
            eli('div', { className: ClassName.ripple }),
            eli('span', { className: ClassName.checkmark }, [
                eliSVG('svg', {
                    class: ClassName.chechmarkSVG,
                    viewBox: '-2 -3 30 30'
                }, [
                    eliSVG('path', {
                        class: ClassName.chechmarkPath,
                        fill: 'none', stroke: 'black',
                        d: 'M1.73,12.91 8.1,19.28 22.79,4.59'
                    })
                ])
            ]),
            eli('span', { role: 'gridcell' }, [
                eli('span', {
                    className: ClassName.primaryAction,
                    role: 'button'
                }, [
                    eli('span', {
                        className: ClassName.text,
                        innerHTML: item.text,
                    })
                ])
            ])
        ]))
    );
}
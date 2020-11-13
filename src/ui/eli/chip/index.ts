import { eli } from 'eli/eli';

const ClassName = {
    chip: 'mdc-chip',
    ripple: 'mdc-chip__ripple',
    primaryAction: 'mdc-chip__primary-action',
    text: 'mdc-chip__text',

    chipSet: 'mdc-chip-set mdc-chip-set--choice',
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
            role: 'grid',
            hidden: true
        },
        items.map((item) => eli('div', {
            className: ClassName.chip,
            id: item.id,
            role: 'row',
        }, [
            eli('div', { className: ClassName.ripple }),
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
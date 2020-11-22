import { eli } from 'eli/eli';
import 'eli/button';

import './style.scss';

const ClassName = {
    card: 'mdc-card mdc-card--outlined',
    actions: 'mdc-card__actions',
    actionButtons: 'mdc-card__action-buttons',
    actionIcons: 'mdc-card__action-icons',
    iconAction: [
        'fa',
        'mdc-icon-button',
        'mdc-card__action',
        'mdc-card__action--icon'
    ].join(' '),
    buttonAction: 'mdc-button mdc-card__action mdc-card__action--button',
    buttonActionRipple: 'mdc-button__ripple',
    buttonActionIcon: 'fa fa-fw mdc-button__icon',
    buttonActionLabel: 'mdc-button__label',
};

export function eliCard(name: string, contents: Array<HTMLElement>): HTMLDivElement {
    return eli('div', { className: `${ClassName.card} ${name}` }, contents);
}

export namespace eliCard {
    export function actions(
        content: { buttons?: Array<HTMLElement>, icons?: Array<HTMLElement> }
    ): HTMLDivElement {
        const element = eli('div', {
            className: ClassName.actions,
        });
        if (content.buttons) {
            element.append(eli('div', { className: ClassName.actionButtons }, content.buttons));
        }
        if (content.icons) {
            element.append(eli('div', { className: ClassName.actionIcons }, content.icons));
        }
        return element;
    }

    export function buttonAction(icon: string, label: string): HTMLButtonElement {
        return eli('button', {
            className: ClassName.buttonAction,
        }, [
            eli('div', { className: ClassName.buttonActionRipple }),
            eli('i', {
                className: ClassName.buttonActionIcon,
                innerHTML: icon
            }),
            eli('span', {
                className: ClassName.buttonActionLabel,
                innerHTML: label
            }),
        ]);
    }

    export function iconAction(icon: string, title: string): HTMLButtonElement {
        return eli('button', {
            className: ClassName.iconAction,
            title: title,
            innerHTML: icon,
        });
    }
}
import i18next from 'i18next';
import { MDCRipple } from '@material/ripple';

import { eli } from 'ui/eli';
import { service } from 'service';
import Nomination from 'service/nomination';

import './style.scss';

type BasicCallback = () => void;

/**
 * Events for {@link NominationCard}
 */
interface NominationCardEvents {
    focus:          BasicCallback;  // Triggered when click the location button to focus in map
    openBs:         BasicCallback;  // Triggered when click the status button to open bs page
    openDetails:    BasicCallback;  // Triggered when click the main action to open details dialog
}

class NominationCard {
    static build(nomination: Nomination, now: number, events: NominationCardEvents) {
        const classNameInfoContent = [
            'margin-r--8',
            'flex-box-row--nowrap',
            'flex-align-items--center',
        ].join(' ');
        const contentsInfo = [];
        contentsInfo.push(eli.build('span', {
            className: classNameInfoContent,
        }, [
            eli.icon('&#xf062'),
            eli.build('span', {
                className: 'margin-l--4',
                innerHTML: nomination.confirmedDateString,
            }),
        ]));
        const restoreTime = nomination.restoreTime;
        if (restoreTime > now) {
            contentsInfo.push(eli.build('span', {
                className: classNameInfoContent,
            }, [
                eli.icon('&#xf2f9'),
                eli.build('span', {
                    className: 'margin-l--4',
                    innerHTML: nomination.restoreIntervalString,
                }),
            ]));
        }
        contentsInfo.push(eli.build('span', {
            className: classNameInfoContent,
        }, [
            eli.icon('&#xf017'),
            eli.build('span', {
                className: 'margin-l--4',
                id: 'text-card-nomination-interval',
            }),
        ]));
        contentsInfo.push(eli.build('span', {
            className: classNameInfoContent,
            id: 'box-card-nomination-result',
        }, [
            eli.icon('&#xf00c'),
            eli.build('span', {
                className: 'margin-l--4',
            }),
        ]));

        const cssTextImg = [
            'object-fit: cover',
            'object-position: center',
            'width: 120px',
            'min-width: 120px',
            'height: 120px',
            'min-height: 120px',
            'border-top-left-radius: 4px',
        ].join(';');
        const elementPrimaryAction = eli.build('div', { }, [
            eli.build('div', {
                className: 'flex-box-row--nowrap',
            }, [
                eli.build('img', {
                    cssText: cssTextImg,
                    src: nomination.imageUrl,
                    loading: 'lazy',
                }),
                eli.build('div', {
                    className: [
                        'padding--8',
                        'flex-box--col',
                        'flex-align-items--start',
                        'flex-justify-content--start'
                    ].join(' '),
                }, [
                    eli.build('span', {
                        className: 'mdc-typography--headline6',
                        innerHTML: nomination.title,
                    }),
                    eli.build('div', {
                        className: 'mdc-typography--body2 flex-box-row--wrap',
                    }, contentsInfo),
                ]),
            ]),
        ]);

        const elementStatus = eli.build('button', {
            className: 'mdc-button mdc-card__action mdc-card__action--button',
        }, [
            eli.build('div', { className: 'mdc-button__ripple' }),
            eli.build('i', {
                className: 'fa fa-fw mdc-button__icon',
            }),
            eli.build('span', { className: 'mdc-button__label' }),
        ]);
        const rippleStatus = new MDCRipple(elementStatus);
        rippleStatus.unbounded = true;
        rippleStatus.listen('click', events.openDetails);

        const actions: Array<HTMLButtonElement> = [];
        actions.push(NominationCard.buildAction(
            'ui.list-view.card.location', 'button-card-nomination-location', '&#xf3c5', true, events.focus
        ));

        if (service.version.full) {
            // Intel Maps
            actions.push(NominationCard.buildAction(
                'ui.list-view.card.intelMap', 'button-card-nomination-intel', '&#xf0ac', true,
                () => window.open(nomination.intelUrl, '_blank', 'noopener')
            ));
        }
        // Brainstorming watermeter
        actions.push(NominationCard.buildAction(
            'ui.list-view.card.bsWatermeter', 'button-card-nomination-bs', '&#xf5dc',
            service.bs.beforeCreate(nomination),
            events.openBs
        ));

        const elementCard = eli.build('div', {
            className: 'mdc-card mdc-card--outlined flex-shrink--0',
            id: `card-${nomination.id}`,
        }, [
            elementPrimaryAction,
            eli.build('div', {
                className: 'mdc-card__actions',
            }, [
                eli.build('div', {
                    className: 'mdc-card__action-buttons',
                }, [ elementStatus ]),
                eli.build('div', {
                    className: 'mdc-card__action-icons',
                }, actions),
            ]),
        ]);
        return elementCard;
    }

    /**
     * Build an icon action
     * @param title Title of the element
     * @param id ID of the element
     * @param icon Icon of the button
     * @param hidden Hidden or not
     * @param click Callback for click event
     */
    private static buildAction(title: string, id: string, icon: string, hidden: boolean, click: BasicCallback): HTMLButtonElement {
        const element = eli.build('button', {
            className: [
                'fa',
                'mdc-icon-button',
                'mdc-card__action',
                'mdc-card__action--icon'
            ].join(' '),
            title: i18next.t(title),
            id: id,
            hidden: hidden,
            innerHTML: icon,
        });
        const rippleLocation = new MDCRipple(element);
        rippleLocation.unbounded = true;
        rippleLocation.listen('click', click);
        return element;
    }

    static update(nomination: Nomination, card: HTMLDivElement) {
        const boxResult = card.querySelector('#box-card-nomination-result') as HTMLSpanElement;
        const type = service.status.getTypeByCode(nomination.status.code);
        card.querySelector('#text-card-nomination-interval').innerHTML = nomination.intervalString;
        if (nomination.status.code > 0) {
            boxResult.hidden = false;
            boxResult.querySelector('i').innerHTML = service.status.types.get(type).icon;
            boxResult.querySelector('span').innerHTML = nomination.resultDateString;
        } else {
            boxResult.hidden = true;
        }
        const buttonStatus = card.querySelector('.mdc-card__action-buttons > button');
        buttonStatus.className = `mdc-button mdc-card__action mdc-card__action--button status-${type}`;
        buttonStatus.querySelector('i').innerHTML = nomination.status.icon;
        buttonStatus.querySelector('span').innerHTML = i18next.t(nomination.status.title);

        const elementBs = card.querySelector('#button-card-nomination-bs') as HTMLDivElement;
        elementBs.hidden = service.bs.beforeCreate(nomination);
    }

    static updateLocation(nomination: Nomination, card: HTMLDivElement) {
        const hidden = nomination.lngLat ? false : true;
        const elementLocation = card.querySelector('#button-card-nomination-location') as HTMLButtonElement;
        elementLocation.hidden = hidden;

        if (!service.version.full) return;
        const elementIntel = card.querySelector('#button-card-nomination-intel') as HTMLButtonElement;
        elementIntel.hidden = hidden;
    }
}

export default NominationCard;
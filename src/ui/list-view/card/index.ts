import i18next from 'i18next';
import { MDCRipple } from '@material/ripple';

import { eli } from 'ui/eli';
import { service } from 'service';
import Nomination from 'service/nomination';

import { ClassName, Icon, StringKey } from './constants';

import './style.scss';

type BasicCallback = () => void;

/**
 * Events for {@link NominationCard}
 */
export interface NominationCardEvents {
    focus:          BasicCallback;  // Triggered when click the location button to focus in map
    openBs:         BasicCallback;  // Triggered when click the status button to open bs page
    openDetails:    BasicCallback;  // Triggered when click the main action to open details dialog
}

export default class NominationCard {
    /**
     * Build a nomination card, a framework with only image and title.
     * 
     * - Details should be put in `.info-box > div > div`
     * - Status button should be put in `.mdc-card__action-buttons`
     * - Icon buttons should be put in `.mdc-card__action-icons`
     * @param nomination Nomination to display
     */
    static build(nomination: Nomination) {
        return eli.build('div', {
            className: ClassName.card,
            id: `card-${nomination.id}`,
        }, [
            eli.build('div', {
                className: 'info-box',
            }, [
                eli.build('img', {
                    src: nomination.imageUrl,
                    loading: 'lazy',
                }),
                eli.build('div', { }, [
                    eli.build('span', { innerHTML: nomination.title }),
                    eli.build('div', { }),
                ]),
            ]),
            eli.build('div', {
                className: 'mdc-card__actions',
            }, [
                eli.build('div', { className: 'mdc-card__action-buttons' }),
                eli.build('div', { className: 'mdc-card__action-icons' }),
            ]),
        ]);
    }

    /**
     * Update the nomination card, add details and actions
     * @param card The card element
     * @param nomination The nomination
     * @param now Current timestamp
     * @param events Events for actions
     */
    static update(
        card: HTMLDivElement,
        nomination: Nomination,
        now: number,
        events: NominationCardEvents
    ) {
        const elementDetails = card.querySelector('.info-box > div > div') as HTMLDivElement;
        elementDetails.innerHTML = '';
        // Confimed date
        elementDetails.append(NominationCard.buildDetail(
            Icon.arrowUp, nomination.confirmedDateString
        ));
        // Restore interval
        const restoreTime = nomination.restoreTime;
        if (restoreTime > now) {
            elementDetails.append(NominationCard.buildDetail(
                Icon.redoAlt, nomination.restoreIntervalString
            ));
        }
        // Interval
        if (nomination.confirmedTime > 0) {
            elementDetails.append(NominationCard.buildDetail(
                Icon.clock, nomination.intervalString
            ));
        }
        // Result
        const type = service.status.getTypeByCode(nomination.status.code);
        if (nomination.status.code > 0) {
            elementDetails.append(NominationCard.buildDetail(
                service.status.types.get(type).icon,
                nomination.resultDateString
            ));
        }

        const elementButtons = card.querySelector('.mdc-card__action-buttons') as HTMLDivElement;
        elementButtons.innerHTML = '';
        const elementStatus = eli.build('button', {
            className: `${ClassName.statusAction} status-${type}`,
        }, [
            eli.build('div', { className: 'mdc-button__ripple' }),
            eli.build('i', {
                className: ClassName.statusActionIcon,
                innerHTML: nomination.status.icon
            }),
            eli.build('span', {
                className: 'mdc-button__label',
                innerHTML: i18next.t(nomination.status.title)
            }),
        ]);
        elementButtons.append(elementStatus);
        const rippleStatus = new MDCRipple(elementStatus);
        rippleStatus.unbounded = true;
        rippleStatus.listen('click', events.openDetails);

        const elementIcons = card.querySelector('.mdc-card__action-icons') as HTMLDivElement;
        elementIcons.innerHTML = '';
        if (nomination.lngLat) {
            // Focus on Map
            elementIcons.append(NominationCard.buildIconAction(
                Icon.mapMarkerAlt, StringKey.location, events.focus
            ));
            if (service.version.full) {
                // Intel Map
                elementIcons.append(NominationCard.buildIconAction(
                    Icon.globe, StringKey.intelMap,
                    () => window.open(nomination.intelUrl, '_blank', 'noopener')
                ));
            }
        }
        // Brainstorming watermeter
        elementIcons.append(NominationCard.buildIconAction(
            Icon.brain, StringKey.bsWatermeter, events.openBs
        ));
    }

    /**
     * Build a detail block
     * @param icon Icon of the detail
     * @param text Text to display
     */
    private static buildDetail(icon: string, text: string): HTMLSpanElement {
        return eli.build('span', { }, [
            eli.icon(icon),
            eli.build('span', { innerHTML: text }),
        ]);
    }

    /**
     * Build an icon action
     * @param icon Icon of the button
     * @param title Title key of the element
     * @param click Callback for click event
     */
    private static buildIconAction(
        icon: string, title: string, click: BasicCallback
    ): HTMLButtonElement {
        const element = eli.build('button', {
            className: ClassName.iconAction,
            title: i18next.t(title),
            innerHTML: icon,
        });
        const rippleLocation = new MDCRipple(element);
        rippleLocation.unbounded = true;
        rippleLocation.listen('click', click);
        return element;
    }
}
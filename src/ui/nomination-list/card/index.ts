import i18next from 'i18next';
import { MDCRipple } from '@material/ripple';

import { eli } from 'eli/eli';
import { eliCard } from 'eli/card';
import { eliIcon } from 'eli/icon';
import { service } from 'service';
import Nomination from 'service/nomination';

import { StringKey } from './constants';

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
        const element = eliCard([
            eli('div', {
                className: 'info-box',
            }, [
                eli('img', {
                    src: nomination.imageUrl,
                    loading: 'lazy',
                }),
                eli('div', { }, [
                    eli('span', { innerHTML: nomination.title }),
                    // Details
                    eli('div', { }),
                ]),
            ]),
            eliCard.actions({ buttons: [], icons: []}),
        ]);
        element.classList.add('nomination-card');
        element.id = `card-${nomination.id}`;
        return element;
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
        // Confirmed date
        elementDetails.append(NominationCard.buildDetail(
            eliIcon.Icon.arrowUp, nomination.confirmedDateString
        ));
        // Restore interval
        const restoreTime = nomination.restoreTime;
        if (restoreTime > now) {
            elementDetails.append(NominationCard.buildDetail(
                eliIcon.Icon.redoAlt, nomination.restoreIntervalString
            ));
        }
        // Interval
        if (nomination.confirmedTime > 0) {
            elementDetails.append(NominationCard.buildDetail(
                eliIcon.Icon.clock, nomination.intervalString
            ));
        }
        // Result
        const type = nomination.status.type;
        if (nomination.status.code > 0) {
            elementDetails.append(NominationCard.buildDetail(
                service.status.types.get(type).icon,
                nomination.resultDateString
            ));
        }

        const elementButtons = card.querySelector('.mdc-card__action-buttons') as HTMLDivElement;
        elementButtons.innerHTML = '';
        const elementStatus = eliCard.buttonAction(
            nomination.status.icon, i18next.t(nomination.status.title)
        );
        elementStatus.classList.add(`status-${type}`);
        elementButtons.append(elementStatus);
        const rippleStatus = new MDCRipple(elementStatus);
        rippleStatus.unbounded = true;
        rippleStatus.listen('click', events.openDetails);

        const elementIcons = card.querySelector('.mdc-card__action-icons') as HTMLDivElement;
        elementIcons.innerHTML = '';
        if (nomination.lngLat) {
            // Focus on Map
            elementIcons.append(NominationCard.buildIconAction(
                eliIcon.Icon.mapMarkerAlt, StringKey.location, events.focus
            ));
            if (service.version.full) {
                // Intel Map
                elementIcons.append(NominationCard.buildIconAction(
                    eliIcon.Icon.globe, StringKey.intelMap,
                    () => window.open(nomination.intelUrl, '_blank', 'noopener')
                ));
            }
        }
        // Brainstorming watermeter
        elementIcons.append(NominationCard.buildIconAction(
            eliIcon.Icon.brain, StringKey.bsWatermeter, events.openBs
        ));
    }

    /**
     * Build a detail block
     * @param icon Icon of the detail
     * @param text Text to display
     */
    private static buildDetail(icon: string, text: string): HTMLSpanElement {
        return eli('span', { }, [
            eliIcon(icon),
            eli('span', { innerHTML: text }),
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
        const element = eliCard.iconAction(icon, i18next.t(title));
        const rippleLocation = new MDCRipple(element);
        rippleLocation.unbounded = true;
        rippleLocation.listen('click', click);
        return element;
    }
}
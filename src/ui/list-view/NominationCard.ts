import i18next from "i18next";
import { MDCRipple } from "@material/ripple";

import AlertDialog from "../dialog/AlertDialog";
import Eli from "../Eli";
import Nomination from '../../service/Nomination';
import Version from "../../service/Version";
import StatusKit from "../../service/StatusKit";

interface NominationCardEvents {
    focus: () => void;
    openDetails: () => void;
}

class NominationCard {
    static build(nomination: Nomination, now: number, events: NominationCardEvents) {
        const classNameInfoContent = [
            'margin-r--8',
            'flex-box-row--nowrap',
            'flex-align-items--center',
        ].join(' ');
        const contentsInfo = [];
        contentsInfo.push(Eli.build('span', {
            className: classNameInfoContent,
        }, [
            Eli.icon('&#xf062'),
            Eli.build('span', {
                className: 'margin-l--4',
                innerHTML: nomination.confirmedDateString,
            }),
        ]));
        const restoreTime = nomination.restoreTime;
        if (restoreTime > now) {
            contentsInfo.push(Eli.build('span', {
                className: classNameInfoContent,
            }, [
                Eli.icon('&#xf2f9'),
                Eli.build('span', {
                    className: 'margin-l--4',
                    innerHTML: nomination.restoreIntervalString,
                }),
            ]));
        }
        contentsInfo.push(Eli.build('span', {
            className: classNameInfoContent,
        }, [
            Eli.icon('&#xf017'),
            Eli.build('span', {
                className: 'margin-l--4',
                id: 'text-card-nomination-interval',
            }),
        ]));
        contentsInfo.push(Eli.build('span', {
            className: classNameInfoContent,
            id: 'box-card-nomination-result',
        }, [
            Eli.icon('&#xf00c'),
            Eli.build('span', {
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
        ].join(';');
        const elementPrimaryAction = Eli.build('div', {
            className: 'mdc-card__primary-action',
        }, [
            Eli.build('div', {
                className: 'flex-box-row--nowrap',
            }, [
                Eli.build('img', {
                    cssText: cssTextImg,
                    src: nomination.imageUrl,
                }),
                Eli.build('div', {
                    className: [
                        'padding--8',
                        'flex-box--col',
                        'flex-align-items--start',
                        'flex-justify-content--start'
                    ].join(' '),
                }, [
                    Eli.build('span', {
                        className: 'mdc-typography--headline6',
                        innerHTML: nomination.title,
                    }),
                    Eli.build('div', {
                        className: 'mdc-typography--body2 flex-box-row--wrap',
                    }, contentsInfo),
                ]),
            ]),
        ]);
        const primaryAction = new MDCRipple(elementPrimaryAction);
        primaryAction.listen('click', events.openDetails);

        const elementActionStatus = Eli.build('button', {
            className: 'mdc-button mdc-card__action mdc-card__action--button',
        }, [
            Eli.build('div', { className: 'mdc-button__ripple' }),
            Eli.build('i', {
                className: 'fa fa-fw mdc-button__icon',
            }),
            Eli.build('span', { className: 'mdc-button__label' }),
        ]);
        const actionStatus = new MDCRipple(elementActionStatus);
        actionStatus.unbounded = true;
        if (Version.fullFeature) {
            actionStatus.listen('click', () => {
                window.open(nomination.bsUrl, '_blank', 'noopener');
            });
        } else {
            actionStatus.listen('click', () => {
                const textarea = Eli.build('textarea', {
                    value: nomination.id, readOnly: true
                });
                document.body.append(textarea);
                textarea.select();
                document.execCommand('copy');
                textarea.remove();
                AlertDialog.open(i18next.t('message:Brainstorming ID copied', { id: nomination.id }));
            });
        }

        const actionIcons = [];
        const classNameAction = [
            'fa',
            'mdc-icon-button',
            'mdc-card__action',
            'mdc-card__action--icon'
        ].join(' ');
        const elementActionLocation = Eli.build('button', {
            className: classNameAction,
            title: i18next.t('Location'),
            id: 'button-card-nomination-location',
            hidden: true,
            innerHTML: '&#xf3c5',
        });
        const actionLocation = new MDCRipple(elementActionLocation);
        actionLocation.unbounded = true;
        actionLocation.listen('click', events.focus);
        actionIcons.push(elementActionLocation);

        if (Version.fullFeature) {
            const elementActionIntel = Eli.build('button', {
                className: classNameAction,
                title: i18next.t('Intel Map'),
                id: 'button-card-nomination-intel',
                hidden: true,
                innerHTML: '&#xf279',
            });
            const actionIntel = new MDCRipple(elementActionIntel);
            actionIntel.unbounded = true;
            actionIntel.listen('click', () => {
                window.open(nomination.intelUrl, '_blank', 'noopener');
            });
            actionIcons.push(elementActionIntel);
        }

        const elementCard = Eli.build('div', {
            className: 'mdc-card mdc-card--outlined flex-shrink--0',
            id: `card-${nomination.id}`,
        }, [
            elementPrimaryAction,
            Eli.build('div', {
                className: 'mdc-card__actions',
            }, [
                Eli.build('div', {
                    className: 'mdc-card__action-buttons',
                }, [ elementActionStatus ]),
                Eli.build('div', {
                    className: 'mdc-card__action-icons',
                }, actionIcons),
            ]),
        ]);
        return elementCard;
    }

    static update(nomination: Nomination, card: HTMLDivElement) {
        const boxResult = card.querySelector('#box-card-nomination-result') as HTMLSpanElement;
        const type = StatusKit.getTypeByCode(nomination.status.code);
        card.querySelector('#text-card-nomination-interval').innerHTML = nomination.intervalString;
        if (nomination.status.code > 0) {
            boxResult.hidden = false;
            boxResult.querySelector('i').innerHTML = StatusKit.types.get(type).icon;
            boxResult.querySelector('span').innerHTML = nomination.resultDateString;
        } else {
            boxResult.hidden = true;
        }
        const buttonStatus = card.querySelector('.mdc-card__action-buttons > button');
        buttonStatus.className = `mdc-button mdc-card__action mdc-card__action--button status-${type}`;
        buttonStatus.querySelector('i').innerHTML = nomination.status.icon;
        buttonStatus.querySelector('span').innerHTML = i18next.t(nomination.status.title);
    }

    static updateLocation(nomination: Nomination, card: HTMLDivElement) {
        const hidden = nomination.lngLat ? false : true;
        const elementLocation = card.querySelector('#button-card-nomination-location') as HTMLButtonElement;
        elementLocation.hidden = hidden;

        if (!Version.fullFeature) return;
        const elementIntel = card.querySelector('#button-card-nomination-intel') as HTMLButtonElement;
        elementIntel.hidden = hidden;
    }
}

export default NominationCard;
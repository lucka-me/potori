import { ripple } from "material-components-web";

import AlertDialog from "./dialog/AlertDialog";
import FilterCard from './dashboard/FilterCard';
import Nomination from '../service/Nomination';
import StatusKit, { StatusReason, StatusType } from '../service/StatusKit';
import UIKitPrototype, { Eli } from './UIKitPrototype';
import Version from '../service/Version';

interface ListViewEvents {
    focus: (nomination: Nomination) => void;
    openDetails: (nomination: Nomination) => void;
}

class ListView extends UIKitPrototype {

    root: HTMLDivElement = null;
    now = Date.now();

    events: ListViewEvents = {
        focus:          () => { },
        openDetails:    () => { },
    };

    constructor() {
        super();
    }

    init(parent: HTMLElement) {
        super.init(parent);
        this.render();
    }

    render() {
        this.root = Eli.build('div', {
            className: [
                'flex--1',
                'flex-box-col',
                'view-hide',
            ].join(' '),
            cssTest: [
                'height: 100%',
                'min-width: 300px',
                'padding: 4px',
                'box-sizing: border-box',
                'overflow-y: scroll',
                'scroll-behavior: smooth',
                '-webkit-overflow-scrolling: touch',
            ].join(';'),
        });
        this.parent.appendChild(this.root);
    }

    clear() { this.root.innerHTML = ''; }

    show(nominations: Array<Nomination>) {
        this.clear();
        for (const nomination of nominations) {
            const card = this.buildCard(nomination);
            this.root.appendChild(card);
        }
    }

    updateVisibility(nomination: Nomination, card: HTMLDivElement) {
        if (nomination.status instanceof StatusReason) {
            card.hidden = !FilterCard.reasons.get(nomination.status).checked;
        } else if (nomination.status instanceof StatusType) {
            card.hidden = !FilterCard.types.get(nomination.status).checked;
        }
    }

    buildCard(nomination: Nomination) {
        const classNameInfoContent = [
            'margin-r--8',
            'flex-box-row--nowrap',
            'flex-align-items--center',
        ].join(' ');
        const contentsInfo = [];
        contentsInfo.push(Eli.build('span', {
            className: classNameInfoContent,
        }, [
            Eli.icon('arrow_upward'),
            Eli.build('span', {
                className: 'margin-l--4',
                innerHTML: nomination.confirmedDateString,
            }),
        ]));
        const restoreTime = nomination.restoreTime;
        if (restoreTime > this.now) {
            contentsInfo.push(Eli.build('span', {
                className: classNameInfoContent,
            }, [
                Eli.icon('restore'),
                Eli.build('span', {
                    className: 'margin-l--4',
                    innerHTML: nomination.restoreIntervalString,
                }),
            ]));
        }
        contentsInfo.push(Eli.build('span', {
            className: classNameInfoContent,
        }, [
            Eli.icon('access_time'),
            Eli.build('span', {
                className: 'margin-l--4',
                id: 'text-card-nomination-interval',
            }),
        ]));
        contentsInfo.push(Eli.build('span', {
            className: classNameInfoContent,
            id: 'box-card-nomination-result',
        }, [
            Eli.icon('check'),
            Eli.build('span', {
                className: 'margin-l--4',
            }),
        ]));

        const cssTestImg = [
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
                    cssTest: cssTestImg,
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
        const primaryAction = new ripple.MDCRipple(elementPrimaryAction);
        primaryAction.listen('click', () => this.events.openDetails(nomination));

        const elementActionStatus = Eli.build('button', {
            className: 'mdc-button mdc-card__action mdc-card__action--button',
        }, [
            Eli.build('div', { className: 'mdc-button__ripple' }),
            Eli.build('i', {
                className: 'material-icons mdc-button__icon',
            }),
            Eli.build('span', { className: 'mdc-button__label' }),
        ]);
        const actionStatus = new ripple.MDCRipple(elementActionStatus);
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
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                AlertDialog.open(`Brainstorming ID copied: ${nomination.id}`);
            });
        }

        const actionIcons = [];
        const classNameAction = [
            'material-icons',
            'mdc-icon-button',
            'mdc-card__action',
            'mdc-card__action--icon'
        ].join(' ');
        const elementActionLocation = Eli.build('button', {
            className: classNameAction,
            title: 'Location',
            id: 'button-card-nomination-location',
            hidden: true,
            innerHTML: 'place',
        });
        const actionLocation = new ripple.MDCRipple(elementActionLocation);
        actionLocation.unbounded = true;
        actionLocation.listen('click', () => this.events.focus(nomination));
        actionIcons.push(elementActionLocation);

        if (Version.fullFeature) {
            const elementActionIntel = Eli.build('button', {
                className: classNameAction,
                title: 'Intel Map',
                id: 'button-card-nomination-intel',
                hidden: true,
                innerHTML: 'map',
            });
            const actionIntel = new ripple.MDCRipple(elementActionIntel);
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
        this.updateCard(nomination, elementCard);
        if (nomination.lngLat) {
            this.updateLocation(nomination, elementCard);
        }
        return elementCard;
    }

    update(nomination: Nomination) {
        const card = this.root.querySelector(`#card-${nomination.id}`) as HTMLDivElement;
        this.updateCard(nomination, card);
        this.updateLocation(nomination, card);
        this.updateVisibility(nomination, card);
    }

    updateCard(nomination: Nomination, card: HTMLDivElement) {
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
        buttonStatus.querySelector('span').innerHTML = nomination.status.title;
    }

    updateLocation(nomination: Nomination, card: HTMLDivElement) {
        const hidden = nomination.lngLat ? false : true;
        const elementLocation = card.querySelector('#button-card-nomination-location') as HTMLButtonElement;
        elementLocation.hidden = hidden;

        if (!Version.fullFeature) return;
        const elementIntel = card.querySelector('#button-card-nomination-intel') as HTMLButtonElement;
        elementIntel.hidden = hidden;
    }
};

export default ListView;
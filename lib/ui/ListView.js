import { UIKitPrototype } from './protorypes.js';
import { Eli } from "./Eli.js";
import { Toolkit } from "../toolkit.js";
import FilterCard from './dashboard/FilterCard.js';

class ListView extends UIKitPrototype {
    constructor() {
        super();
        this.root = null;
        this.now = Date.now();

        this.event = {
            focus: (portal) => { pportal },
            openDetails: (portal) => { portal },
        };
    }

    init(parent) {
        this.root = Eli.build('div', {
            className: [
                'flex--1',
                'flex-box-col',
            ].join(' '),
            styleText: [
                'height: 100%',
                'min-width: 300px',
                'padding: 4px',
                'box-sizing: border-box',
                'overflow-y: scroll',
                'scroll-behavior: smooth',
                '-webkit-overflow-scrolling: touch',
            ].join(';'),
        });
        parent.appendChild(this.root);
    }

    clear() { this.root.innerHTML = ''; }

    show() {
        this.clear();

        for (const portal of service.portals) {
            const card = this.buildCard(portal);
            this.root.appendChild(card);
        }
    }

    updateVisibility(portal, card) {
        const type = Toolkit.getTypeByCode(portal.status);
        if (type === 'rejected') {
            const reason = Toolkit.getReasonByCode(portal.status);
            card.hidden = !FilterCard.reason[reason].checked;
        } else {
            card.hidden = !FilterCard.type[type].checked;
        }
    }

    buildCard(portal) {
        const classNameInfoContent = [
            'margin-r--8',
            'flex-box-row--nowrap',
            'flex-align-items--center',
        ].join(' ');
        const contentsInfo = [];
        contentsInfo.push(Eli.build('span', {
            className: classNameInfoContent,
            children: [
                Eli.icon('arrow_upward'),
                Eli.build('span', {
                    className: 'margin-l--4',
                    innerHTML: Toolkit.getDateString(portal.confirmedTime),
                }),
            ],
        }));
        const restoreTime = portal.confirmedTime + (14 * 24 * 3600 * 1000);
        if (restoreTime > this.now) {
            contentsInfo.push(Eli.build('span', {
                className: classNameInfoContent,
                children: [
                    Eli.icon('restore'),
                    Eli.build('span', {
                        className: 'margin-l--4',
                        innerHTML:  Toolkit.getIntervalString(this.now, restoreTime),
                    }),
                ],
            }));
        }
        contentsInfo.push(Eli.build('span', {
            className: classNameInfoContent,
            children: [
                Eli.icon('access_time'),
                Eli.build('span', {
                    className: 'margin-l--4',
                    id: 'text-card-portal-interval',
                }),
            ],
        }));
        contentsInfo.push(Eli.build('span', {
            className: classNameInfoContent,
            id: 'box-card-portal-result',
            children: [
                Eli.icon('check'),
                Eli.build('span', {
                    className: 'margin-l--4',
                }),
            ],
        }));

        const styleTextImg = [
            'object-fit: cover',
            'object-position: center',
            'width: 120px',
            'min-width: 120px',
            'height: 120px',
            'min-height: 120px',
        ].join(';');
        const elementPrimaryAction = Eli.build('div', {
            className: 'mdc-card__primary-action',
            children: [
                Eli.build('div', {
                    className: 'flex-box-row--nowrap',
                    children: [
                        Eli.build('img', {
                            styleText: styleTextImg,
                            src: `${value.string.path.image}${portal.image}`
                        }),
                        Eli.build('div', {
                            className: [
                                'padding--8', 'flex-box--col',
                                'flex-align-items--start', 'flex-justify-content--start'
                            ].join(' '),
                            children: [
                                Eli.build('span', {
                                    className: 'mdc-typography--headline6',
                                    innerHTML: portal.title,
                                }),
                                Eli.build('div', {
                                    className: 'mdc-typography--body2 flex-box-row--wrap',
                                    children: contentsInfo,
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        });
        const primaryAction = new mdc.ripple.MDCRipple(elementPrimaryAction);
        primaryAction.listen('click', () => this.event.openDetails(portal));

        const elementActionStatus = Eli.build('button', {
            className: 'mdc-button mdc-card__action mdc-card__action--button',
            children: [
                Eli.build('div', { className: 'mdc-button__ripple' }),
                Eli.build('i', {
                    className: 'material-icons mdc-button__icon',
                }),
                Eli.build('span', { className: 'mdc-button__label' }),
            ],
        });
        const actionStatus = new mdc.ripple.MDCRipple(elementActionStatus);
        actionStatus.unbounded = true;
        if (versionKit.fullFeature) {
            actionStatus.listen('click', () => {
                window.open(`${value.string.path.bsWatermeter}${portal.id}`,
                            '_blank', 'noopener');
            });
        } else {
            actionStatus.listen('click', () => {
                Toolkit.copyText(portal.id);
                AlertDialog.open(`Brainstorming ID copied: ${portal.id}`);
            });
        }

        const actionIcons = [];
        const elementActionLocation = Eli.build('button', {
            className: 'material-icons mdc-icon-button mdc-card__action mdc-card__action--icon',
            title: 'Location',
            id: 'button-card-portal-location',
            hidden: true,
            innerHTML: 'place',
        });
        const actionLocation = new mdc.ripple.MDCRipple(elementActionLocation);
        actionLocation.unbounded = true;
        actionLocation.listen('click', () => this.event.focus(portal));
        actionIcons.push(elementActionLocation);

        if (versionKit.fullFeature) {
            const elementActionIntel = Eli.build('button', {
                className: 'material-icons mdc-icon-button mdc-card__action mdc-card__action--icon',
                title: 'Intel Map',
                id: 'button-card-portal-intel',
                hidden: true,
                innerHTML: 'map',
            });
            const actionIntel = new mdc.ripple.MDCRipple(elementActionIntel);
            actionIntel.unbounded = true;
            actionIntel.listen('click', () => {
                window.open(Toolkit.lngLatToIntel(portal.lngLat), '_blank', 'noopener');
            });
            actionIcons.push(elementActionIntel);
        }

        const elementCard = Eli.build('div', {
            className: 'mdc-card mdc-card--outlined portal-card flex-shrink--0',
            id: `card-${portal.id}`,
            children: [
                elementPrimaryAction,
                Eli.build('div', {
                    className: 'mdc-card__actions',
                    children: [
                        Eli.build('div', {
                            className: 'mdc-card__action-buttons',
                            children: [ elementActionStatus ],
                        }),
                        Eli.build('div', {
                            className: 'mdc-card__action-icons',
                            children: actionIcons,
                        }),
                    ],
                }),
            ],
        });
        this.updateCard(portal, elementCard);
        if (portal.lngLat) {
            this.updateLocation(portal, elementCard);
        }
        return elementCard;
    }

    update(portal) {
        const card = document.getElementById(`card-${portal.id}`);
        this.updateCard(portal, card);
        this.updateLocation(portal, card);
        this.updateVisibility(portal, card);
    }

    updateCard(portal, card) {
        const boxResult = card.querySelector('#box-card-portal-result');
        const type = Toolkit.getTypeByCode(portal.status);
        if (portal.status > 0) {
            card.querySelector('#text-card-portal-interval').innerHTML = Toolkit.getIntervalString(portal.confirmedTime, portal.resultTime);
            boxResult.hidden = false;
            boxResult.querySelector('i').innerHTML = value.data.type[type].icon;
            boxResult.querySelector('span').innerHTML = Toolkit.getDateString(portal.resultTime);
        } else {
            card.querySelector('#text-card-portal-interval').innerHTML = Toolkit.getIntervalString(portal.confirmedTime, this.now);
            boxResult.hidden = true;
        }
        const buttonStatus = card.querySelector('.mdc-card__action-buttons > button');
        const matchedData = Toolkit.matchData(portal.status);
        buttonStatus.className = `mdc-button mdc-card__action mdc-card__action--button status-${type}`;
        buttonStatus.querySelector('i').innerHTML = matchedData.icon;
        buttonStatus.querySelector('span').innerHTML = matchedData.title;
    }

    updateLocation(portal, card) {
        const hidden = portal.lngLat ? false : true;
        const elementLocation = card.querySelector('#button-card-portal-location');
        elementLocation.hidden = hidden;

        if (!versionKit.fullFeature) return;
        const elementIntel = card.querySelector('#button-card-portal-intel');
        elementIntel.hidden = hidden;
    }
};

export { ListView };
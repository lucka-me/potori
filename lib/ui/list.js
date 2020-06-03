ui.list = {
    root: null,
    now: 0,
    init(parent) {
        this.now = Date.now();
        this.root = eliKit.build('div', {
            className: [
                'flex--1',
                'flex-box-col',
            ].join(' '),
            styleText: [
                'min-width: 300px',
                'padding: 4px',
                'overflow-y: scroll',
                'scroll-behavior: smooth',
                '-webkit-overflow-scrolling: touch',
            ].join(';'),
        });
        parent.appendChild(this.root);
    },
    clear() { this.root.innerHTML = ''; },
    show() {
        this.clear();

        for (const portal of process.portals) {
            const card = this.buildCard(portal);
            this.root.appendChild(card);
        }
    },
    updateVisibility(portal, card) {
        const type = toolkit.getTypeByCode(portal.status);
        if (type === 'rejected') {
            const reason = toolkit.getReasonByCode(portal.status);
            card.hidden = !dashboard.card.filter.reason[reason].checked;
        } else {
            card.hidden = !dashboard.card.filter.type[type].checked;
        }
    },
    buildCard(portal) {
        const classNameInfoContent = 'margin-r--8 flex-box-row--nowrap flex-align-items--center';
        const contentsInfo = [];
        contentsInfo.push(eliKit.build('span', {
            className: classNameInfoContent,
            children: [
                eliKit.icon('arrow_upward'),
                eliKit.build('span', {
                    className: 'margin-l--4',
                    innerHTML: toolkit.getDateString(portal.confirmedTime),
                }),
            ],
        }));
        const restoreTime = portal.confirmedTime + (14 * 24 * 3600 * 1000);
        if (restoreTime > this.now) {
            contentsInfo.push(eliKit.build('span', {
                className: classNameInfoContent,
                children: [
                    eliKit.icon('restore'),
                    eliKit.build('span', {
                        className: 'margin-l--4',
                        innerHTML:  toolkit.getIntervalString(this.now, restoreTime),
                    }),
                ],
            }));
        }
        contentsInfo.push(eliKit.build('span', {
            className: classNameInfoContent,
            children: [
                eliKit.icon('access_time'),
                eliKit.build('span', {
                    className: 'margin-l--4',
                    id: 'text-card-portal-interval',
                }),
            ],
        }));
        contentsInfo.push(eliKit.build('span', {
            className: classNameInfoContent,
            id: 'box-card-portal-result',
            children: [
                eliKit.icon('check'),
                eliKit.build('span', {
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
        const elementPrimaryAction = eliKit.build('div', {
            className: 'mdc-card__primary-action',
            children: [
                eliKit.build('div', {
                    className: 'flex-box-row--nowrap',
                    children: [
                        eliKit.build('img', {
                            styleText: styleTextImg,
                            src: `${value.string.path.image}${portal.image}`
                        }),
                        eliKit.build('div', {
                            className: [
                                'padding--8', 'flex-box--col',
                                'flex-align-items--start', 'flex-justify-content--start'
                            ].join(' '),
                            children: [
                                eliKit.build('span', {
                                    className: 'mdc-typography--headline6',
                                    innerHTML: portal.title,
                                }),
                                eliKit.build('div', {
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
        primaryAction.listen('click', () => dialog.details.open(portal));

        const elementActionStatus = eliKit.build('button', {
            className: 'mdc-button mdc-card__action mdc-card__action--button',
            children: [
                eliKit.build('div', { className: 'mdc-button__ripple' }),
                eliKit.build('i', {
                    className: 'material-icons mdc-button__icon',
                }),
                eliKit.build('span', { className: 'mdc-button__label' }),
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
                toolkit.copyText(portal.id);
                dialog.alert.open(`Brainstorming ID copied: ${portal.id}`);
            });
        }

        const actionIcons = [];
        const elementActionLocation = eliKit.build('button', {
            className: 'material-icons mdc-icon-button mdc-card__action mdc-card__action--icon',
            title: 'Location',
            id: 'button-card-portal-location',
            hidden: true,
            innerHTML: 'place',
        });
        const actionLocation = new mdc.ripple.MDCRipple(elementActionLocation);
        actionLocation.unbounded = true;
        actionLocation.listen('click', () => {
            mapKit.ctrl.easeTo({ center: portal.lngLat, zoom: 16 })
        });
        actionIcons.push(elementActionLocation);

        if (versionKit.fullFeature) {
            const elementActionIntel = eliKit.build('button', {
                className: 'material-icons mdc-icon-button mdc-card__action mdc-card__action--icon',
                title: 'Intel Map',
                id: 'button-card-portal-intel',
                hidden: true,
                innerHTML: 'map',
            });
            const actionIntel = new mdc.ripple.MDCRipple(elementActionIntel);
            actionIntel.unbounded = true;
            actionIntel.listen('click', () => {
                window.open(toolkit.lngLatToIntel(portal.lngLat), '_blank', 'noopener');
            });
            actionIcons.push(elementActionIntel);
        }

        const elementCard = eliKit.build('div', {
            className: 'mdc-card mdc-card--outlined portal-card flex-shrink--0',
            id: `card-${portal.id}`,
            children: [
                elementPrimaryAction,
                eliKit.build('div', {
                    className: 'mdc-card__actions',
                    children: [
                        eliKit.build('div', {
                            className: 'mdc-card__action-buttons',
                            children: [ elementActionStatus ],
                        }),
                        eliKit.build('div', {
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
    },
    updateCard(portal, card) {
        const boxResult = card.querySelector('#box-card-portal-result');
        const type = toolkit.getTypeByCode(portal.status);
        if (portal.status > 0) {
            card.querySelector('#text-card-portal-interval').innerHTML = toolkit.getIntervalString(portal.confirmedTime, portal.resultTime);
            boxResult.hidden = false;
            boxResult.querySelector('i').innerHTML = value.data.type[type].icon;
            boxResult.querySelector('span').innerHTML = toolkit.getDateString(portal.resultTime);
        } else {
            card.querySelector('#text-card-portal-interval').innerHTML = toolkit.getIntervalString(portal.confirmedTime, this.now);
            boxResult.hidden = true;
        }
        const buttonStatus = card.querySelector('.mdc-card__action-buttons > button');
        const matchedData = toolkit.matchData(portal.status);
        buttonStatus.className = `mdc-button mdc-card__action mdc-card__action--button status-${type}`;
        buttonStatus.querySelector('i').innerHTML = matchedData.icon;
        buttonStatus.querySelector('span').innerHTML = matchedData.title;
    },
    updateLocation(portal, card) {
        const hidden = portal.lngLat ? false : true;
        const elementLocation = card.querySelector('#button-card-portal-location');
        elementLocation.hidden = hidden;

        if (!versionKit.fullFeature) return;
        const elementIntel = card.querySelector('#button-card-portal-intel');
        elementIntel.hidden = hidden;
    },
};
const ui = {
    appBar: {
        status:     null,
        openFile:   null,
        saveFile:   null,
        uploadFile: null,
        auth:       null,
        signout:    null,
        init: () => {
            const appBarActionDiv = document.querySelector(".mdc-top-app-bar__section--align-end");
            for (const key of Object.keys(ui.appBar)) {
                const buttonElement = document.createElement("button");
                buttonElement.className = "mdc-icon-button material-icons mdc-top-app-bar__action-item--unbounded";
                buttonElement.title = value.string.title.appBarButton[key];
                buttonElement.innerHTML = value.string.html.icon.appBar[key];
                appBarActionDiv.appendChild(buttonElement);
                ui.appBar[key] = new mdc.ripple.MDCRipple(buttonElement);
                ui.appBar[key].unbounded = true;
                ui.appBar[key].listen("click", ui.event.button[key]);
                buttonElement.hidden = true;
            }
            ui.appBar.status.root_.hidden = false;
        },
    },
    dialog: {
        status: {
            ctrl: new mdc.dialog.MDCDialog(document.querySelector("#dialog-status")),
            block: {
                all:            document.getElementById("block-dialog-status-all"),
                rejectedReason: document.getElementById("block-dialog-status-rejectedReason"),
            },
            filter: {
                all: {
                    accepted: { switch: null, label:  null, },
                    rejected: { switch: null, label:  null, },
                    pending:  { switch: null, label:  null, },
                },
                rejectedReason: {
                    undeclared: { switch: null, label:  null, },
                    duplicated: { switch: null, label:  null, },
                    tooClose:   { switch: null, label:  null, },
                },
            },
            init : () => {
                for (const block of Object.keys(ui.dialog.status.filter)) {
                    for (const key of (Object.keys(ui.dialog.status.filter[block]))) {
                        const switchId = `switch-filter-${block}-${key}`;
                        
                        const switchBox = document.getElementById("template-switchBox").content.cloneNode(true);
                        const switchElement = switchBox.querySelector(".mdc-switch");
                        switchElement.id = switchId;
                        const switchLabel = switchBox.querySelector("label");
                        switchLabel.for = switchId;
                        const labelIcon = switchLabel.querySelector("i");
                        labelIcon.className += value.string.html.css[block === "all" ? key : "rejected"];
                        labelIcon.title = value.string.title.status[key];
                        labelIcon.innerHTML = value.string.html.icon[key];
                        ui.dialog.status.block[block].appendChild(switchBox);

                        ui.dialog.status.filter[block][key].switch = new mdc.switchControl.MDCSwitch(switchElement);
                        ui.dialog.status.filter[block][key].label  = switchLabel.querySelector("span");
                    }
                    ui.dialog.status.block[block].hidden = true;
                }
            },
        },
        details: {
            ctrl: new mdc.dialog.MDCDialog(document.querySelector("#dialog-details")),
            show: (portal) => {
                const onOpened = () => {
                    if (!ui.details.map.ctrl) ui.details.init();
                    if (ui.details.map.marker) ui.details.map.marker.remove();
                    ui.details.map.marker = null;
                    if (portal.lngLat) {
                        ui.details.map.marker = new mapboxgl.Marker()
                            .setLngLat(portal.lngLat)
                            .addTo(ui.details.map.ctrl);
                        ui.details.map.ctrl.jumpTo({ center: portal.lngLat, zoom: 16 });
                    }

                    if (portal.status === value.code.status.pending) {
                        ui.details.status.pending.radio.checked = true;
                        ui.details.rejectedReasonSelect.root_.hidden = true;
                        ui.details.resultDateField.root_.hidden = true;
                        ui.details.resultTimeField.root_.hidden = true;
                    } else {
                        const dateTime = toolkit.getDateTimeISOString(portal.resultTime).split("T");
                        ui.details.resultDateField.root_.hidden = false;
                        ui.details.resultTimeField.root_.hidden = false;
                        ui.details.resultDateField.value = dateTime[0];
                        ui.details.resultTimeField.value = dateTime[1].slice(0, dateTime[1].lastIndexOf(":"));
                        if (portal.status === value.code.status.accepted) {
                            ui.details.status.accepted.radio.checked = true;
                            ui.details.rejectedReasonSelect.root_.hidden = true;
                        } else {
                            ui.details.status.rejected.radio.checked = true;
                            ui.details.rejectedReasonSelect.root_.hidden = false;
                            ui.details.rejectedReasonSelect.selectedIndex = portal.status - value.code.status.rejected.undeclared;
                        }
                    }
                };

                const onClosed = (event) => {
                    if (event.detail.action === "save") {
                        // TODO: Check date and time, save, update card and marker
                    }
                };

                ui.dialog.details.listen("MDCDialog:opened", onOpened);
                ui.dialog.details.listen("MDCDialog:closed", onClosed);
                ui.dialog.details.root_.querySelector(".mdc-dialog__title").innerHTML = portal.title;
                ui.dialog.details.root_.querySelector("img").src = value.string.path.image + portal.image;
                ui.dialog.details.root_.querySelector("#dialogPortalConfirmedTime").innerHTML = toolkit.getDateTimeString(portal.confirmedTime);
                ui.dialog.details.open();
            }
        },
        alert:  {
            ctrl: new mdc.dialog.MDCDialog(document.querySelector("#dialog-alert")),
            show: (message, title = "Alert") => {
                ui.dialog.alert.open();
                ui.dialog.alert.root_.querySelector("#dialogAlertTitle").innerHTML = title;
                ui.dialog.alert.root_.querySelector("#dialogAlertMessageBox").innerHTML = message;
            },
        },
    },
    // Portal Details
    details: {
        map: {
            ctrl: null,
            marker: null,
            edit: null,
            search: null,
            delete: null,
        },
        status: {
            accepted: { radio: null, field: null, },
            rejected: { radio: null, field: null, },
            pending:  { radio: null, field: null, },
        },
        rejectedReasonSelect: null,
        resultDateField: null,
        resultTimeField: null,
        init: () => {
            const dialogElement = ui.dialog.details.root_;
            ui.details.map.ctrl = new mapboxgl.Map({ container: "map-dialog-details", style: value.string.mapbox.style });
            ui.details.map.ctrl.addControl(new mapboxgl.NavigationControl());

            ui.details.map.edit = new mdc.ripple.MDCRipple(dialogElement.querySelector("#button-dialog-details-map-edit"));
            ui.details.map.edit.unbounded = true;
            if (versionKit.fullFeature) {
                ui.details.map.search = new mdc.ripple.MDCRipple(dialogElement.querySelector("#button-dialog-details-map-search"));
                ui.details.map.search.unbounded = true;
            } else {
                dialogElement.querySelector("#button-dialog-details-map-search").hidden = true;
            }
            ui.details.map.delete = new mdc.ripple.MDCRipple(dialogElement.querySelector("#button-dialog-details-map-delete"));
            ui.details.map.delete.unbounded = true;

            for (let key of Object.keys(ui.details.status)) {
                const selector = `#field-dialog-details-status-${key}`;
                ui.details.status[key].radio = new mdc.radio.MDCRadio(dialogElement.querySelector(`${selector} > .mdc-radio`));
                ui.details.status[key].radio.disabled = true;   // TODO
                ui.details.status[key].field = new mdc.formField.MDCFormField(dialogElement.querySelector(selector));
                ui.details.status[key].field.input = ui.details.status[key].radio;
            }

            ui.details.rejectedReasonSelect = new mdc.select.MDCSelect(ui.dialog.details.root_.querySelector("#dialogPortalRejectedReasonSelect"));
            ui.details.rejectedReasonSelect.disabled = true;    // TODO

            ui.details.resultDateField = new mdc.textField.MDCTextField(document.querySelector("#dialogPortalResultDateField"));
            ui.details.resultDateField.disabled = true; // TODO
            ui.details.resultTimeField = new mdc.textField.MDCTextField(document.querySelector("#dialogPortalResultTimeField"));
            ui.details.resultTimeField.disabled = true; // TODO
        },
    },
    progressBar: new mdc.linearProgress.MDCLinearProgress(document.querySelector("#progressBar")),
    mainMap: {
        ctrl: null,
        load: () => {
            mapboxgl.accessToken = value.string.mapbox.accessToken;
            ui.mainMap.ctrl = new mapboxgl.Map({ container: "map-main", style: value.string.mapbox.style });
            ui.mainMap.ctrl.addControl(new mapboxgl.NavigationControl());
        },
    },
    cardList: document.getElementById("cardList"),
    event: {
        button: {
            status:     (_) => ui.dialog.status.ctrl.open(),
            openFile:   (_) => fileKit.local.openFile(),
            saveFile:   (_) => fileKit.local.saveFile(),
            uploadFile: (_) => fileKit.googleDrive.uploadFile(),
            auth:       (_) => { },
            signout:    (_) => { },
        },
        changeShow: (portals, show) => {
            for (let portal of portals) {
                if (portal.marker) portal.marker.getElement().hidden = !show;
                document.getElementById(`card-${portal.id}`).hidden = !show;
            }
        },
        scrollToCard: (id) => {
            ui.cardList.scrollTo(0, document.getElementById(`card-${id}`).offsetTop - ui.cardList.offsetTop - 8);
        },
    },
    init: () => {
        document.getElementById("dialogStatusVersion").innerHTML = value.string.version[versionKit.code];
        ui.appBar.init();
        ui.dialog.status.init();
    },
    refresh: () => {
        ui.appBar.openFile.root_.hidden = false;
        ui.appBar.saveFile.root_.hidden = true;
        for (let key of Object.keys(ui.dialog.status.block)) ui.dialog.status.block[key].hidden = true;
        ui.cardList.innerHTML = "";
        for (let portal of process.portalList) if (portal.marker) portal.marker.remove();
        ui.progressBar.root_.hidden = true;
        ui.progressBar.buffer = 0;
        ui.progressBar.progress = 0;
    },
    getIconElement: (portal) => {
        const iconDiv = document.createElement("div");
        iconDiv.className = "map-marker";
        const icon = document.createElement("span");
        icon.className = "material-icons md-18";
        switch (portal.status) {
            case value.code.status.pending:
                iconDiv.className += `${value.string.html.css.pending}--bg`;
                icon.innerHTML = value.string.html.icon.pending;
                break;
            case value.code.status.accepted:
                iconDiv.className += `${value.string.html.css.accepted}--bg`;
                icon.innerHTML = value.string.html.icon.accepted;
                break;
            default:
                switch (portal.status) {
                    case value.code.status.rejected.tooClose:
                        icon.innerHTML = value.string.html.icon.tooClose;
                        break;
                    case value.code.status.rejected.duplicated:
                        icon.innerHTML = value.string.html.icon.duplicated;
                        break;
                    default:
                        icon.innerHTML = value.string.html.icon.undeclared;
                        break;
                }
                iconDiv.className += `${value.string.html.css.rejected}--bg`;
                break;
        }
        iconDiv.appendChild(icon);
        return iconDiv;
    },
    fillLocation: (portal, card) => {
        const icon = ui.getIconElement(portal);
        icon.onclick = () => ui.event.scrollToCard(portal.id);
        if (portal.marker) portal.marker.remove();
        portal.marker = new mapboxgl.Marker({ element: icon })
            .setLngLat(portal.lngLat)
            .setPopup(new mapboxgl.Popup({ closeButton: false }).setText(portal.title))
            .addTo(ui.mainMap.ctrl);

        const locationButton = card.querySelector("#button-card-location");
        locationButton.hidden = false;
        const locationRipple = new mdc.ripple.MDCRipple(locationButton);
        locationRipple.unbounded = true;
        locationRipple.listen("click", () => ui.mainMap.ctrl.easeTo({ center: portal.lngLat, zoom: 16 }));

        if (versionKit.fullFeature) {
            const intelButton = card.querySelector("#button-card-intel");
            intelButton.hidden = false;
            const intelRipple = new mdc.ripple.MDCRipple(intelButton);
            intelRipple.unbounded = true;
            intelRipple.listen("click", () => window.open(toolkit.lngLatToIntel(portal.lngLat), "_blank", "noopener"));
        }
    },
    display: () => {
        const boundsNE = { lng: -181.0, lat: -91.0 };
        const boundsSW = { lng: 181.0, lat: 91.0 };

        const extendBounds = (lngLat) => {
            if (lngLat.lng > boundsNE.lng) boundsNE.lng = lngLat.lng;
            else if (lngLat.lng < boundsSW.lng) boundsSW.lng = lngLat.lng;
            if (lngLat.lat > boundsNE.lat) boundsNE.lat = lngLat.lat;
            else if (lngLat.lat < boundsSW.lat) boundsSW.lat = lngLat.lat;
        };

        const classifiedList = {
            pending: [],
            accepted: [],
            rejected: [],
            rejectedReason: {
                undeclared: [],
                duplicated: [],
                tooClose: [],
            },
            noLngLat: [],
        };

        // Create cards, extend bounds and classify
        for (let portal of process.portalList) {
            const card = document.getElementById("template-card").content.cloneNode(true);

            card.querySelector(".mdc-card").id = `card-${portal.id}`;

            const mainAction = new mdc.ripple.MDCRipple(card.querySelector(".mdc-card__primary-action"));
            mainAction.listen("click", () => ui.dialog.show.details(portal));

            card.querySelector("img").src = value.string.path.image + portal.image;
            card.querySelector("#cardTitle").innerHTML = portal.title;
            card.querySelector("#cardConfirmedTime").innerHTML = toolkit.getDateString(portal.confirmedTime);
            if (portal.resultTime) {
                card.querySelector("#cardInterval").innerHTML = toolkit.getIntervalString(portal.confirmedTime, portal.resultTime);
                card.querySelector("#cardResultBox").hidden = false;
                card.querySelector("#cardResultTime").innerHTML = toolkit.getDateString(portal.resultTime);
            } else {
                card.querySelector("#cardInterval").innerHTML = toolkit.getIntervalString(portal.confirmedTime, new Date().getTime());
                card.querySelector("#cardResultBox").hidden = true;
            }
            const resultIcon        = card.querySelector("#cardResultIcon");
            const statusButton      = card.querySelector("#cardStatusButton");
            const statusButtonIcon  = card.querySelector("#cardStatusButtonIcon");
            const statusButtonLabel = card.querySelector("#cardStatusButtonLabel");

            switch (portal.status) {
                case value.code.status.pending:
                    statusButton.className += value.string.html.css.pending;
                    statusButtonIcon.innerHTML = value.string.html.icon.pending;
                    statusButtonLabel.innerHTML = "Pending";
                    classifiedList.pending.push(portal);
                    break;
                case value.code.status.accepted:
                    resultIcon.innerHTML = value.string.html.icon.accepted;
                    statusButton.className += value.string.html.css.accepted;
                    statusButtonIcon.innerHTML = value.string.html.icon.accepted;
                    statusButtonLabel.innerHTML = "Accepted";
                    classifiedList.accepted.push(portal);
                    break;
                default:
                    switch (portal.status) {
                        case value.code.status.rejected.tooClose:
                            statusButtonIcon.innerHTML = value.string.html.icon.tooClose;
                            statusButtonLabel.innerHTML = "Too Close";
                            classifiedList.rejectedReason.tooClose.push(portal);
                            break;
                        case value.code.status.rejected.duplicated:
                            statusButtonIcon.innerHTML = value.string.html.icon.duplicated;
                            statusButtonLabel.innerHTML = "Duplicated";
                            classifiedList.rejectedReason.duplicated.push(portal);
                            break;
                        default:
                            statusButtonIcon.innerHTML = value.string.html.icon.undeclared;
                            statusButtonLabel.innerHTML = "Rejected";
                            classifiedList.rejectedReason.undeclared.push(portal);
                            break;
                    }
                    statusButton.className += value.string.html.css.rejected;
                    resultIcon.innerHTML = value.string.html.icon.rejected;
                    classifiedList.rejected.push(portal);
                    break;
            }
            const statusRipple = new mdc.ripple.MDCRipple(statusButton);
            statusRipple.unbounded = true;
            if (versionKit.fullFeature) {
                statusRipple.listen("click", () => window.open(value.string.path.bsWatermeter + portal.id, "_blank"));
            } else {
                statusRipple.listen("click", () => {
                    const textarea = document.createElement("textarea");
                    textarea.value = portal.id;
                    textarea.readOnly = true;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand("copy");
                    document.body.removeChild(textarea);
                    ui.dialog.show.alert(`Brainstorming ID copied: ${portal.id}`);
                });
            }
            
            if (portal.lngLat) {
                extendBounds(portal.lngLat);
                ui.fillLocation(portal, card);
            } else {
                classifiedList.noLngLat.push(portal);
            }

            ui.cardList.appendChild(card);
        }

        if (boundsNE.lng > -180 && boundsNE.lat > -90 && boundsSW.lng < 180 && boundsSW.lat < 90) {
            ui.mainMap.ctrl.fitBounds([boundsSW, boundsNE], {
                padding: 16,
                linear: true
            });
        }
        
        const getCountString = (portals) => portals.length === 0 ? "0 (0%)" : `${portals.length} (${(portals.length / process.portalList.length * 100).toFixed(1)}%)`;
        
        const getRejectedCountString = (portals) => portals.length === 0 ? "0 (0%)" : `${portals.length} (${(portals.length / classifiedList.rejected.length * 100).toFixed(1)}%)`;

        ui.dialog.status.filter.all.accepted.label.innerHTML = getCountString(classifiedList.accepted);
        ui.dialog.status.filter.all.accepted.switch.listen("change", (_) => ui.event.changeShow(classifiedList.accepted, ui.dialog.status.filter.all.accepted.switch.checked));
        ui.dialog.status.filter.all.rejected.label.innerHTML = getCountString(classifiedList.rejected);
        ui.dialog.status.filter.all.rejected.switch.listen("change", (_) => {
            for (let key of Object.keys(classifiedList.rejectedReason)) {
                ui.dialog.status.filter.rejectedReason[key].switch.checked = ui.dialog.status.filter.all.rejected.switch.checked;
            }
            ui.event.changeShow(classifiedList.rejected, ui.dialog.status.filter.all.rejected.switch.checked);
        });
        ui.dialog.status.filter.all.pending.label.innerHTML  = getCountString(classifiedList.pending);
        ui.dialog.status.filter.all.pending.switch.listen("change", (_) => ui.event.changeShow(classifiedList.pending, ui.dialog.status.filter.all.pending.switch.checked));

        for (let key of Object.keys(classifiedList.rejectedReason)) {
            const portals = classifiedList.rejectedReason[key];
            ui.dialog.status.filter.rejectedReason[key].label.innerHTML = getRejectedCountString(portals);
            ui.dialog.status.filter.rejectedReason[key].switch.listen("change", (_) => ui.event.changeShow(portals, ui.dialog.status.filter.rejectedReason[key].switch.checked));
        }
        for (let key of Object.keys(ui.dialog.status.block)) ui.dialog.status.block[key].hidden = false;

        const onFinished = () => {
            ui.appBar.saveFile.root_.hidden = false;
            ui.appBar.uploadFile.root_.hidden = !gapi.auth2.getAuthInstance().isSignedIn.get();
            ui.progressBar.root_.hidden = true;
        };

        if (versionKit.fullFeature && (classifiedList.noLngLat.length > 0)) {
            let count = 0;
            const countUp = () => {
                count += 1;
                if (count === classifiedList.noLngLat.length) onFinished();
            };
            for (let portal of classifiedList.noLngLat) {
                firebaseKit.queryLngLat(
                    portal.id,
                    (lngLat) => {
                        portal.lngLat = lngLat;
                        ui.fillLocation(portal, document.getElementById(`card-${portal.id}`));
                        countUp();
                    },
                    countUp
                );
            }
        } else {
            onFinished();
        }
    },
};
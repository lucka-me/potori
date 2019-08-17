/* FOR FULL */
const ui = {
    button: {
        status:     new mdc.ripple.MDCRipple(document.querySelector("#buttonStatus")),
        openFile:   new mdc.ripple.MDCRipple(document.querySelector("#buttonOpenFile")),
        saveFile:   new mdc.ripple.MDCRipple(document.querySelector("#buttonSaveFile")),
        uploadFile: new mdc.ripple.MDCRipple(document.querySelector("#buttonUploadFile")),
        auth:       new mdc.ripple.MDCRipple(document.querySelector("#buttonAuth")),
        signout:    new mdc.ripple.MDCRipple(document.querySelector("#buttonSignout")),
    },
    status: {
        block: {
            all: document.getElementById("dialogStatusAll"),
            rejectedReason: document.getElementById("dialogStatusRejectedReason"),
        },
        filter: {
            accepted: {
                switch: new mdc.switchControl.MDCSwitch(document.querySelector("#filterAcceptedSwitch")),
                label:  document.getElementById("filterAcceptedLabel"),
            },
            rejected: {
                switch: new mdc.switchControl.MDCSwitch(document.querySelector("#filterRejectedSwitch")),
                label:  document.getElementById("filterRejectedLabel"),
            },
            pending: {
                switch: new mdc.switchControl.MDCSwitch(document.querySelector("#filterPendingSwitch")),
                label:  document.getElementById("filterPendingLabel"),
            },
            undeclared: {
                switch: new mdc.switchControl.MDCSwitch(document.querySelector("#filterRejectedUndeclaredSwitch")),
                label:  document.getElementById("filterRejectedUndeclaredLabel"),
            },
            duplicated: {
                switch: new mdc.switchControl.MDCSwitch(document.querySelector("#filterRejectedDuplicatedSwitch")),
                label:  document.getElementById("filterRejectedDuplicatedLabel"),
            },
            tooClose: {
                switch: new mdc.switchControl.MDCSwitch(document.querySelector("#filterRejectedTooCloseSwitch")),
                label:  document.getElementById("filterRejectedTooCloseLabel"),
            },
        },
    },
    dialog: {
        status: new mdc.dialog.MDCDialog(document.querySelector("#dialogStatus")),
        alert: new mdc.dialog.MDCDialog(document.querySelector("#dialogAlert")),
        show: {
            alert: (message, title = "Alert") => {
                ui.dialog.alert.open();
                ui.dialog.alert.root_.querySelector("#dialogAlertTitle").innerHTML = title;
                ui.dialog.alert.root_.querySelector("#dialogAlertMessageBox").innerHTML = message;
            },
        }
    },
    progressBar: new mdc.linearProgress.MDCLinearProgress(document.querySelector("#progressBar")),
    map: {
        mapCtrl: null,
        load: () => {
            mapboxgl.accessToken = value.string.mapbox.accessToken;
            ui.map.mapCtrl = new mapboxgl.Map({ container: "map", style: value.string.mapbox.style });
            ui.map.mapCtrl.addControl(new mapboxgl.NavigationControl());
        },
        easeTo: (lngLat) => ui.map.mapCtrl.easeTo({ center: lngLat, zoom: 16 }),
    },
    cardList: document.getElementById("cardList"),
    init: () => {
        document.getElementById("dialogStatusVersion").innerHTML = value.string.version.full;
        for (let key of Object.keys(ui.button)) {
            ui.button[key].unbounded = true;
            ui.button[key].listen("click", ui.event.button[key]);
        }
    },
    refresh: () => {
        ui.button.openFile.root_.hidden = false;
        ui.button.saveFile.root_.hidden = true;
        for (let key of Object.keys(ui.status.block)) ui.status.block[key].hidden = true;
        ui.cardList.innerHTML = "";
        for (let portal of process.portalList) if (portal.marker) portal.marker.remove();
        ui.progressBar.root_.hidden = true;
        ui.progressBar.buffer = 0;
        ui.progressBar.progress = 0;
    },
    event: {
        button: {
            status:     (_) => ui.dialog.status.open(),
            openFile:   (_) => fileKit.local.openFile(),
            saveFile:   (_) => fileKit.local.saveFile(),
            uploadFile: (_) => fileKit.googleDrive.uploadFile(),
            auth:       (_) => { },
            signout:    (_) => { },
        },
        changeShow: (portals, show) => {
            if (show) {
                for (let portal of portals) {
                    if (portal.marker) portal.marker.getElement().hidden = false;
                    document.getElementById("card-" + portal.id).hidden = false;
                }
            } else {
                for (let portal of portals) {
                    if (portal.marker) portal.marker.getElement().hidden = true;
                    document.getElementById("card-" + portal.id).hidden = true;
                }
            }
        },
        scrollToCard: (id) => {
            ui.cardList.scrollTo(0, document.getElementById("card-" + id).offsetTop - ui.cardList.offsetTop - 8);
        },
    },
    display: () => {
        // Merge duplicated portals
        for (let i = process.portalList.length - 1; i >= 0; i--) {
            const portal = process.portalList[i];

            for (let j = 0; j < i; j++) {
                if (portal.id !== process.portalList[j].id) continue;
                const targetPortal = process.portalList[j];
                if (targetPortal.status === value.code.portalStatus.pending) {
                    targetPortal.status = portal.status;
                    targetPortal.lngLat = portal.lngLat;
                    targetPortal.resultTime = portal.resultTime;
                    targetPortal.resultMailId = portal.resultMailId;
                } else {
                    targetPortal.confirmedTime = portal.confirmedTime;
                    targetPortal.confirmationMailId = portal.confirmationMailId;
                }
                process.portalList.splice(i, 1);
                break;
            }
        }

        // Sort by time
        process.portalList.sort((a, b) => {
            const timeA = a.resultTime ? a.resultTime : a.confirmedTime;
            const timeB = b.resultTime ? b.resultTime : b.confirmedTime;
            return timeA < timeB ? 1 : -1;
        });

        const boundsNE = { lng: -181.0, lat: -91.0 };
        const boundsSW = { lng: 181.0, lat: 91.0 };

        const extendBounds = (lngLat) => {
            if (lngLat.lng > boundsNE.lng) boundsNE.lng = lngLat.lng;
            else if (lngLat.lng < boundsSW.lng) boundsSW.lng = lngLat.lng;
            if (lngLat.lat > boundsNE.lat) boundsNE.lat = lngLat.lat;
            else if (lngLat.lat < boundsSW.lat) boundsSW.lat = lngLat.lat;
        };

        const fillLngLatInfo = (portal, card) => {
            const iconDiv = document.createElement("div");
            iconDiv.className = "map-marker";
            const icon = document.createElement("span");
            icon.className = "material-icons md-18";
            switch (portal.status) {
                case value.code.portalStatus.pending:
                    iconDiv.className += value.string.html.css.pending + "--bg";
                    icon.innerHTML = value.string.html.icon.pending;
                    break;
                case value.code.portalStatus.accepted:
                    iconDiv.className += value.string.html.css.accepted + "--bg";
                    icon.innerHTML = value.string.html.icon.accepted;
                    break;
                default:
                    switch (portal.status) {
                        case value.code.portalStatus.rejected.tooClose:
                            icon.innerHTML = value.string.html.icon.rejectedReason.tooClose;
                            break;
                        case value.code.portalStatus.rejected.duplicated:
                            icon.innerHTML = value.string.html.icon.rejectedReason.duplicated;
                            break;
                        default:
                            icon.innerHTML = value.string.html.icon.rejectedReason.undeclared;
                            break;
                    }
                    iconDiv.className += value.string.html.css.rejected + "--bg";
                    break;
            }
            iconDiv.appendChild(icon);
            iconDiv.onclick = () => ui.event.scrollToCard(portal.id);
            portal.marker = new mapboxgl.Marker({ element: iconDiv })
                .setLngLat(portal.lngLat)
                .setPopup(new mapboxgl.Popup({ closeButton: false }).setText(portal.title))
                .addTo(ui.map.mapCtrl);

            const locationButton = card.querySelector("#cardLocationButton");
            locationButton.hidden = false;
            const locationRipple = new mdc.ripple.MDCRipple(locationButton);
            locationRipple.unbounded = true;
            locationRipple.listen("click", () => ui.map.easeTo(portal.lngLat));

            const intelButton = card.querySelector("#cardIntelButton");
            intelButton.hidden = false;
            const intelRipple = new mdc.ripple.MDCRipple(intelButton);
            intelRipple.unbounded = true;
            intelRipple.listen("click", () => window.open(toolkit.lngLatToIntel(portal.lngLat), "_blank"));
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
            const card = document.getElementById("cardTemplate").content.cloneNode(true);

            card.querySelector(".mdc-card").id = "card-" + portal.id;
            card.getElementById("cardImage").src = value.string.path.image + portal.image;
            card.getElementById("cardTitle").innerHTML = portal.title;
            card.getElementById("cardConfirmedTime").innerHTML = toolkit.getDateString(portal.confirmedTime);
            if (portal.resultTime) {
                card.getElementById("cardInterval").innerHTML = toolkit.getIntervalString(portal.confirmedTime, portal.resultTime);
                card.getElementById("cardResultTime").innerHTML = toolkit.getDateString(portal.resultTime);
            } else {
                card.getElementById("cardInterval").innerHTML = toolkit.getIntervalString(portal.confirmedTime, new Date().getTime());
                card.getElementById("cardResultBox").hidden = true;
            }
            const resultIcon        = card.getElementById("cardResultIcon");
            const statusButton      = card.getElementById("cardStatusButton");
            const statusButtonIcon  = card.getElementById("cardStatusButtonIcon");
            const statusButtonLabel = card.getElementById("cardStatusButtonLabel");

            switch (portal.status) {
                case value.code.portalStatus.pending:
                    statusButton.className += value.string.html.css.pending;
                    statusButtonIcon.innerHTML = value.string.html.icon.pending;
                    statusButtonLabel.innerHTML = "Pending";
                    classifiedList.pending.push(portal);
                    break;
                case value.code.portalStatus.accepted:
                    resultIcon.innerHTML = value.string.html.icon.accepted;
                    statusButton.className += value.string.html.css.accepted;
                    statusButtonIcon.innerHTML = value.string.html.icon.accepted;
                    statusButtonLabel.innerHTML = "Accepted";
                    classifiedList.accepted.push(portal);
                    break;
                default:
                    switch (portal.status) {
                        case value.code.portalStatus.rejected.tooClose:
                            statusButtonIcon.innerHTML = value.string.html.icon.rejectedReason.tooClose;
                            statusButtonLabel.innerHTML = "Too Close";
                            classifiedList.rejectedReason.tooClose.push(portal);
                            break;
                        case value.code.portalStatus.rejected.duplicated:
                            statusButtonIcon.innerHTML = value.string.html.icon.rejectedReason.duplicated;
                            statusButtonLabel.innerHTML = "Duplicated";
                            classifiedList.rejectedReason.duplicated.push(portal);
                            break;
                        default:
                            statusButtonIcon.innerHTML = value.string.html.icon.rejectedReason.undeclared;
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
            statusRipple.listen("click", () => window.open(value.string.path.bsWatermeter + portal.id, "_blank"));

            if (portal.lngLat) {
                extendBounds(portal.lngLat);
                fillLngLatInfo(portal, card);
            } else {
                classifiedList.noLngLat.push(portal);
            }

            ui.cardList.appendChild(card);
        }

        if (boundsNE.lng > -180 && boundsNE.lat > -90 && boundsSW.lng < 180 && boundsSW.lat < 90) {
            ui.map.mapCtrl.fitBounds([boundsSW, boundsNE], {
                padding: 16,
                linear: true
            });
        }

        const getCountString = (portals) => portals.length === 0 ? "0 (0%)" : (portals.length + " (" + (portals.length / process.portalList.length * 100).toFixed(1) + "%)");
        const getRejectedCountString = (portals) => portals.length === 0 ? "0 (0%)" : (portals.length + " (" + (portals.length / classifiedList.rejected.length * 100).toFixed(1) + "%)");

        ui.status.filter.accepted.label.innerHTML = getCountString(classifiedList.accepted);
        ui.status.filter.accepted.switch.listen("change", (_) => ui.event.changeShow(classifiedList.accepted, ui.status.filter.accepted.switch.checked));
        ui.status.filter.rejected.label.innerHTML = getCountString(classifiedList.rejected);
        ui.status.filter.rejected.switch.listen("change", (_) => {
            for (let key of Object.keys(classifiedList.rejectedReason)) {
                ui.status.filter[key].switch.checked = ui.status.filter.rejected.switch.checked;
            }
            ui.event.changeShow(classifiedList.rejected, ui.status.filter.rejected.switch.checked);
        });
        ui.status.filter.pending.label.innerHTML  = getCountString(classifiedList.pending);
        ui.status.filter.pending.switch.listen("change", (_) => ui.event.changeShow(classifiedList.pending, ui.status.filter.pending.switch.checked));

        for (let key of Object.keys(classifiedList.rejectedReason)) {
            const portals = classifiedList.rejectedReason[key];
            ui.status.filter[key].label.innerHTML = getRejectedCountString(portals);
            ui.status.filter[key].switch.listen("change", (_) => ui.event.changeShow(portals, ui.status.filter[key].switch.checked));
        }
        for (let key of Object.keys(ui.status.block)) ui.status.block[key].hidden = false;

        const onFinished = () => {
            ui.button.saveFile.root_.hidden = false;
            ui.button.uploadFile.root_.hidden = !gapi.auth2.getAuthInstance().isSignedIn.get();
            ui.progressBar.root_.hidden = true;
        }

        if (classifiedList.noLngLat.length > 0) {
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
                        fillLngLatInfo(portal, document.getElementById("card-" + portal.id));
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
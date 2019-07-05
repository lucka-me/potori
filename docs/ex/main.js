/* BEGIN: Firebase */

const firebaseKit = {
    reference: null,
    init: function() { firebase.initializeApp({ databaseURL: value.string.path.bsDatabase }); },
    loadReference: function() { 
        firebaseKit.reference = firebase.database().ref(value.string.path.bsReference);
        ui.control.status.innerHTML = value.string.status.openFile;
        ui.refresh();
    },
    queryLngLat: function(bsId, onSuccess, onFailed){
        firebaseKit.reference.child(bsId).once(
            "value",
            function(data){
                let value = data.val();
                if(value == null) {
                    onFailed();
                    return;
                }
                onSuccess({ lng: parseFloat(value.lng), lat: parseFloat(value.lat) });
            },
            function(_error) { onFailed(); },
            this
        );
    },
};

/* END: Firebase */

/* BEGIN: Process Mails */

const portalList = [];

const process = {
    display: function() {
        // Merge duplicated portals
        for (let i = portalList.length - 1; i >= 0; i--) {
            let portal = portalList[i];

            for (let j = 0; j < i; j++) {
                if (portal.id !== portalList[j].id) continue;
                let targetPortal = portalList[j];
                if (targetPortal.status === value.code.portalStatus.pending) {
                    targetPortal.status = portal.status;
                    targetPortal.lngLat = portal.lngLat;
                    targetPortal.resultTime = portal.resultTime;
                    targetPortal.resultMailId = portal.resultMailId;
                } else {
                    targetPortal.confirmedTime = portal.confirmedTime;
                    targetPortal.confirmationMailId = portal.confirmationMailId;
                }
                portalList.splice(i, 1);
                break;
            }
        }

        ui.control.received.row.hidden = false;
        ui.control.received.progress.cell.hidden = true;
        ui.control.received.count.innerHTML = portalList.length;

        for (let key of Object.keys(ui.control.portals)) {
            ui.control.portals[key].row.hidden = false;
            if (ui.control.portals[key].progress) {
                ui.control.portals[key].progress.cell.hidden = true;
            }
        }

        // Sort by time
        portalList.sort(function(a, b) {
            let timeA = a.resultTime ? a.resultTime : a.confirmedTime;
            let timeB = b.resultTime ? b.resultTime : b.confirmedTime;
            return timeA < timeB ? 1 : -1;
        });

        let boundsNE = { lng: -181.0, lat: -91.0 };
        let boundsSW = { lng: 181.0, lat: 91.0 };

        let extendBounds = function(lngLat) {
            if (lngLat.lng > boundsNE.lng) boundsNE.lng = lngLat.lng;
            else if (lngLat.lng < boundsSW.lng) boundsSW.lng = lngLat.lng;
            if (lngLat.lat > boundsNE.lat) boundsNE.lat = lngLat.lat;
            else if (lngLat.lat < boundsSW.lat) boundsSW.lat = lngLat.lat;
        };

        let getDateString = function(time) {
            let date = new Date();
            date.setTime(time);
            return date.toLocaleDateString();
        };

        let getIntervalString = (start, end) => Math.floor((end - start) / (24 * 3600 * 1000)) + " days";

        let fillLngLatInfo = function(portal, card) {
            card.querySelector("#portalTitle").hidden = true;
            let portalTitleLink = card.querySelector("#portalTitleLink");
            portalTitleLink.innerHTML = portal.title;
            portalTitleLink.href = toolkit.lngLatToIntel(portal.lngLat);
            portalTitleLink.hidden = false;

            card.querySelector("#card-" + portal.id).onclick = function() { ui.map.easeTo(portal.lngLat); };

            let iconElement = card.querySelector("#statusIconStackDiv").cloneNode(true);
            iconElement.onclick = function() { ui.event.scrollToCard(portal.id); };
            portal.marker = new mapboxgl.Marker({ element: iconElement })
                .setLngLat(portal.lngLat)
                .setPopup(new mapboxgl.Popup({ closeButton: false }).setText(portal.title))
                .addTo(ui.map.mapCtrl);
        };

        let classifiedList = {
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
        for (let i = 0; i < portalList.length; i++) {
            let portal = portalList[i];
            let card = document.getElementById("templateCard").content.cloneNode(true);

            card.getElementById("card").id = "card-" + portal.id;
            card.getElementById("bsLink").href = value.string.path.bsWatermeter + portal.id;
            card.getElementById("portalImg").src = value.string.path.image + portal.image;
            card.getElementById("portalConfirmedTime").innerHTML = getDateString(portal.confirmedTime);

            if (portal.resultTime) {
                card.getElementById("portalInterval").innerHTML = getIntervalString(portal.confirmedTime, portal.resultTime);
                card.getElementById("portalResultTime").innerHTML = getDateString(portal.resultTime);
            } else {
                card.getElementById("portalInterval").innerHTML = getIntervalString(portal.confirmedTime, new Date().getTime());
                card.getElementById("portalResultBox").hidden = true;
            }

            let statusIconStack = card.getElementById("statusIconStack");
            let statusIconSpan = card.getElementById("statusIconSpan");
            let portalResultIcon = card.getElementById("portalResultIcon");
            switch (portal.status) {
                case value.code.portalStatus.pending:
                    statusIconSpan.className = value.string.css.statusIconSpan.pending;
                    statusIconStack.className = value.string.css.statusIcon.pending;
                    classifiedList.pending.push(portal);
                    break;
                case value.code.portalStatus.accepted:
                    statusIconSpan.className = value.string.css.statusIconSpan.accepted;
                    statusIconStack.className = value.string.css.statusIcon.accepted;
                    portalResultIcon.className = value.string.css.resultIcon.accepted;
                    classifiedList.accepted.push(portal);
                    break;
                default:
                    switch (portal.status) {
                        case value.code.portalStatus.rejected.tooClose:
                            statusIconStack.className = value.string.css.statusIcon.rejectedReason.tooClose;
                            statusIconStack.title = value.string.rejectedReason.tooClose;
                            classifiedList.rejectedReason.tooClose.push(portal);
                            break;
                        case value.code.portalStatus.rejected.duplicated:
                            statusIconStack.className = value.string.css.statusIcon.rejectedReason.duplicated;
                            statusIconStack.title = value.string.rejectedReason.duplicated;
                            classifiedList.rejectedReason.duplicated.push(portal);
                            break;
                        default:
                            statusIconStack.className = value.string.css.statusIcon.rejectedReason.undeclared;
                            statusIconStack.title = value.string.rejectedReason.undeclared;
                            classifiedList.rejectedReason.undeclared.push(portal);
                            break;
                    }
                    portalResultIcon.className = value.string.css.resultIcon.rejected;
                    classifiedList.rejected.push(portal);
                    break;
            }

            if (portal.lngLat) {
                fillLngLatInfo(portal, card);
                extendBounds(portal.lngLat);
            } else {
                card.getElementById("portalTitle").innerHTML = portal.title;
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

        let getCountString = (list) => list.length === 0 ? "0 (0%)" : (list.length + " (" + (list.length / portalList.length * 100).toFixed(2) + "%)");

        ui.control.portals.accepted.count.innerHTML = getCountString(classifiedList.accepted);
        ui.control.portals.rejected.count.innerHTML = getCountString(classifiedList.rejected);
        ui.control.portals.pending.row.hidden = false;
        ui.control.portals.pending.count.innerHTML = getCountString(classifiedList.pending);

        let initCheckBox = function(target, portals) {
            target.disabled = false;
            target.onchange = function() { ui.event.changeShow(portals, target.checked); };
        };

        for (let key of Object.keys(classifiedList.rejectedReason)) {
            let portals = classifiedList.rejectedReason[key];
            if (portals.length < 1) continue;
            let count = classifiedList.rejectedReason[key].length;
            ui.control.portals.rejectedReason.reasons[key].count.innerHTML = count + " (" + (count / classifiedList.rejected.length * 100).toFixed(2) + "%)";
            initCheckBox(ui.control.portals.rejectedReason.reasons[key].checkShow, portals);
        }

        if (classifiedList.accepted.length > 0) {
            initCheckBox(ui.control.portals.accepted.checkShow, classifiedList.accepted);
        }
        if (classifiedList.rejected.length > 0) {
            initCheckBox(ui.control.portals.rejected.checkShow, classifiedList.rejected);
            ui.control.portals.rejected.checkShow.disabled = false;
            ui.control.portals.rejected.checkShow.onchange = function() {
                let checked = ui.control.portals.rejected.checkShow.checked;
                for (let key of Object.keys(ui.control.portals.rejectedReason.reasons)) {
                    ui.control.portals.rejectedReason.reasons[key].checkShow.checked = checked;
                }
                ui.event.changeShow(classifiedList.rejected, checked);
            };
            ui.control.portals.rejectedReason.row.hidden = false;
            ui.control.portals.rejectedReason.collapse.style.display = "inline";
        }
        if (classifiedList.pending.length > 0) {
            initCheckBox(ui.control.portals.pending.checkShow, classifiedList.pending);
        }
        ui.control.collapseAll.style.display = "inline";

        let onFinished = function() {
            ui.control.status.innerHTML = value.string.status.finished;
            ui.button.saveFile.hidden = false;
        }

        if (classifiedList.noLngLat.length > 0) {
            ui.control.status.innerHTML = value.string.status.queryingBs;
            let count = 0;
            let countUp = function() {
                count += 1;
                if (count === classifiedList.noLngLat.length) onFinished();
            };
            for (let portal of classifiedList.noLngLat) {
                firebaseKit.queryLngLat(
                    portal.id,
                    function(lngLat){
                        portal.lngLat = lngLat;
                        let card = document.getElementById("card-" + portal.id).parentNode;
                        fillLngLatInfo(portal, card);
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
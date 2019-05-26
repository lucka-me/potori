/* BEGIN: Google Auth */

const auth = {
    handleClientLoad: function() { gapi.load("client:auth2", auth.initClient); },
    initClient: function() {
        gapi.client.init(value.string.gapiOptions).then(
            function () {
                // Listen for sign-in state changes.
                gapi.auth2.getAuthInstance().isSignedIn.listen(auth.updateStatus);
                // Handle the initial sign-in state.
                auth.updateStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                ui.button.auth.onclick = function(event) { gapi.auth2.getAuthInstance().signIn(); };
                ui.button.signout.onclick = function(event) { gapi.auth2.getAuthInstance().signOut(); };
            },
            function(error) { alert(JSON.stringify(error, null, 2)); }
        );
    },
    updateStatus: function(isSignedIn) {
        if (isSignedIn) {
            ui.button.auth.hidden = true;
            ui.button.signout.hidden = false;
            process.start();
        } else {
            ui.button.auth.hidden = false;
            ui.button.signout.hidden = true;
            ui.control.status.innerHTML = value.string.status.authFirst;
            ui.control.received.row.hidden = true;
            for (let key of Object.keys(ui.control.portals)) {
                ui.control.portals[key].row.hidden = true;
                ui.control.portals[key].checkShow.disabled = true;
            }
            ui.cardList.innerHTML = "";
            for (let i = 0; i < portalList.length; i++) {
                if (portalList[i].marker) portalList[i].marker.remove()
            }
            portalList.splice(0, portalList.length);
        }
    },
};

/* END: Google Auth */

/* BEGIN: Process Mails */

const portalList = [];

const process = {
    status: {
        all: function() {
            for (let scanner of Object.keys(process.status))
                for (let type of Object.keys(process.status[scanner]))
                    if (!process.status[scanner][type]) return false;
            return true;
        },
        redacted: { confirmation: false, acceptance: false, rejection: false, },
        prime: { confirmation: false, acceptance: false, rejection: false, },
    },
    start: function() {
        ui.control.status.innerHTML = value.string.status.processing;
        for (let scanner of Object.keys(value.string.key.scanner)) {
            for (let type of Object.keys(value.string.key.type)) {
                process.mails({ scanner: value.string.key.scanner[scanner], type: value.string.key.type[type] });
            }
        }
    },
    mails: function(keys) {

        let query = value.string.mail.query[keys.scanner][keys.type.mail];

        let status = process.status[keys.scanner][keys.type.mail];
        process.status[keys.scanner][keys.type.mail] = false;

        let progressUI = (keys.type === value.string.key.type.confirmation) ? ui.control.received : ui.control.portals[keys.type.ui];
        progressUI.row.hidden = false;
        progressUI.progress.cell.hidden = false;
        progressUI.count.hidden = true;
        let progressSpan = progressUI.progress[keys.scanner];
        progressSpan.innerHTML = value.string.status.loading;

        let getListRequest = function(pageToken) {
            return gapi.client.gmail.users.messages.list({
                "userId": "me",
                "q": query,
                "pageToken": pageToken
            });
        };

        let requestListHandler = function(response) {
            list = list.concat(response.result.messages);
            if (response.result.nextPageToken) {
                let request = getListRequest(response.result.nextPageToken);
                request.execute(requestListHandler);
            } else {
                processMailList(list);
            }
        };

        let processMailList = function(list) {
            progressSpan.innerHTML = "0/" + list.length;
            let count = 0;
            for (let i = 0; i < list.length; i++) {
                let request = gapi.client.gmail.users.messages.get({
                    "userId": "me",
                    "id": list[i].id,
                    "format": "full",
                    "metadataHeaders": ["Subject"]
                });
                request.execute(function(fullMail) {
                    portalList.push(process.parse.mail(fullMail, keys));
                    count += 1;
                    progressSpan.innerHTML = count + "/" + list.length;
                    if (count === list.length) {
                        process.status[keys.scanner][keys.type.mail] = true;
                        list = [];
                        if (process.status.prime[keys.type.mail] && process.status.redacted[keys.type.mail]) {
                            progressUI.progress.cell.hidden = true;
                            progressUI.count.hidden = false;
                            progressUI.count.innerHTML = value.string.status.waiting;
                        }
                        if (process.status.all()) display();
                    };
                });
            }
        };

        // Begin
        let list = [];
        let request = getListRequest(null);
        request.execute(requestListHandler);
    },
    parse: {
        mail: function(fullMail, keys) {
            let portal = {};
            if (keys.type === value.string.key.type.confirmation) {
                portal.confirmedTime = fullMail.internalDate;
                portal.status = value.code.portalStatus.pending;
            } else {
                portal.resultTime = fullMail.internalDate;
                portal.status = value.code.portalStatus.accepted;
            }

            // Subject -> Title
            for (let i = 0; i < fullMail.payload.headers.length; i++) {
                let header = fullMail.payload.headers[i];
                if (header.name === "Subject") {
                    let subject = header.value;
                    let hwPos = subject.search(":");
                    let fwPos = subject.search("：");
                    portal.title = subject.slice((fwPos < 0 ? hwPos : (hwPos < 0 ? fwPos : (fwPos < hwPos ? fwPos : hwPos))) + 1).trim();
                    break;
                }
            }

            // Body -> image, id lngLat and rejectReason
            for (let i = 0; i < fullMail.payload.parts.length; i++) {
                let part = fullMail.payload.parts[i];
                if (part.partId === "1") {
                    let mailBody = toolkit.decodeBase64(part.body.data);
                    let imageTmp = mailBody.slice(mailBody.search(/googleusercontent\.com/));
                    for (let keyword of ["\"", "\n"]) {
                        let slicePos = imageTmp.search(keyword);
                        if (slicePos > 0) imageTmp = imageTmp.slice(0, slicePos);
                    }
                    portal.image = imageTmp.replace("googleusercontent.com/", "");
                    portal.id = toolkit.getBsId(portal.image);
                    if (keys.scanner === value.string.key.scanner.redacted && keys.type !== value.string.key.type.confirmation) {
                        portal.lngLat = process.parse.lngLat(mailBody);
                    }
                    if (keys.type === value.string.key.type.rejection) {
                        portal.status = process.parse.rejectedReason(mailBody, keys.scanner);
                    }
                    break;
                }
            }
            return portal;
        },
        rejectedReason: function(mailBody, scanner) {
            let reason = value.code.portalStatus.rejected.undeclared;
            for (let key of Object.keys(value.string.mail.keyword[scanner].rejectedReason)) {
                for (let keyword of value.string.mail.keyword[scanner].rejectedReason[key]) {
                    if (mailBody.search(keyword) > -1) {
                        reason = value.code.portalStatus.rejected[key];
                        break;
                    }
                }
                if (reason !== value.code.portalStatus.rejected.undeclared) break;
            }
            return reason;
        },
        lngLat: function(mailBody) {
            let intel = mailBody.slice(mailBody.search(value.string.path.intel));
            intel = intel.slice(0, intel.search("\">"));
            let lngLatPair = intel.slice(intel.search("ll=") + 3, intel.search("&z=18")).split(",");
            return {
                lng: parseFloat(lngLatPair[1]),
                lat: parseFloat(lngLatPair[0])
            };
        },
    }
};

function display() {
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
            } else {
                targetPortal.confirmedTime = portal.confirmedTime;
            }
            portalList.splice(i, 1);
            break;
        }
    }

    ui.control.received.count.innerHTML = portalList.length;

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

    let classifiedList = {
        pending: [],
        accepted: [],
        rejected: [],
        rejectedReason: {
            undeclared: [],
            duplicated: [],
            tooClose: [],
        },
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
            card.getElementById("portalTitle").hidden = true;
            let portalTitleLink = card.getElementById("portalTitleLink");
            portalTitleLink.innerHTML = portal.title;
            portalTitleLink.href = toolkit.lngLatToIntel(portal.lngLat);
            portalTitleLink.hidden = false;

            card.getElementById("card-" + portal.id).onclick = function() { ui.map.easeTo(portal.lngLat); };

            let iconElement = card.getElementById("statusIconStackDiv").cloneNode(true);
            iconElement.onclick = function() { ui.event.scrollToCard(portal.id); };
            portal.marker = new mapboxgl.Marker({ element: iconElement })
                .setLngLat(portal.lngLat)
                .setPopup(new mapboxgl.Popup({ closeButton: false }).setText(portal.title))
                .addTo(ui.map.mapCtrl);

            extendBounds(portal.lngLat);
        } else {
            card.getElementById("portalTitle").innerHTML = portal.title;
        }

        ui.cardList.appendChild(card);
    }

    if (boundsNE.lng > -180 && boundsNE.lat > -90 && boundsSW.lng < 180 && boundsSW.lat < 90) {
        ui.map.mapCtrl.fitBounds([boundsSW, boundsNE], {
            padding: 16,
            linear: true
        });
    }
    
    ui.control.status.innerHTML = value.string.status.finished;

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
}
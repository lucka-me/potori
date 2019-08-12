/* BEGIN: Google Auth */

const auth = {
    handleClientLoad: () => gapi.load("client:auth2", auth.initClient),
    initClient: () => {
        gapi.client.init(value.string.gapiOptions).then(
            () => {
                // Listen for sign-in state changes.
                gapi.auth2.getAuthInstance().isSignedIn.listen(auth.updateStatus);
                // Handle the initial sign-in state.
                ui.button.auth.listen("click", (_) => gapi.auth2.getAuthInstance().signIn());
                ui.button.signout.listen("click", (_) => gapi.auth2.getAuthInstance().signOut());
                auth.updateStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            },
            (error) => alert(JSON.stringify(error, null, 2))
        );
    },
    updateStatus: (isSignedIn) => {
        if (isSignedIn) {
            ui.button.auth.root_.hidden = true;
            ui.button.signout.root_.hidden = false;
            process.start();
        } else {
            process.portalList = [];
            ui.init();
            ui.button.auth.root_.hidden = false;
            ui.button.signout.root_.hidden = true;
            ui.button.uploadFile.root_.hidden = true;
        }
    },
};

/* END: Google Auth */

/* BEGIN: Firebase */

const firebaseKit = {
    reference: null,
    init: () => firebase.initializeApp({ databaseURL: value.string.path.bsDatabase }),
    loadReference: function() { firebaseKit.reference = firebase.database().ref(value.string.path.bsReference) },
    queryLngLat: function(bsId, onSuccess, onFailed) {
        this.reference.child(bsId).once(
            "value",
            (data) => {
                let value = data.val();
                if (value == null) {
                    onFailed();
                    return;
                }
                onSuccess({ lng: parseFloat(value.lng), lat: parseFloat(value.lat) });
            },
            (_) => onFailed()
        );
    },
};

/* END: Firebase */

/* BEGIN: Process Mails */
const process = {
    portalList: [],
    _ignoreMailIdList: [],
    status: {
        list: 0,
        total: 0,
        finished: 0,
    },
    start: () => {
        ui.init();
        process.status.list = 0;
        process.status.total = 0;
        process.status.finished = 0;
        ui.button.openFile.root_.hidden = true;
        ui.button.saveFile.root_.hidden = true;
        ui.progressBar.root_.hidden = false;

        const onGetFileFinished = () => {
            // Ignore the mails those already in the list
            process._ignoreMailIdList  = [];
            for (let portal of process.portalList) {
                process._ignoreMailIdList.push(portal.confirmationMailId);
                if (portal.resultMailId) process._ignoreMailIdList.push(portal.resultMailId);
            }
            for (let scanner of Object.keys(value.string.key.scanner)) {
                for (let type of Object.keys(value.string.key.type)) {
                    process.mails({ scanner: value.string.key.scanner[scanner], type: value.string.key.type[type] });
                }
            }
        };

        fileKit.googleDrive.getFile(onGetFileFinished);        
    },
    mails: (keys) => {
        let query = value.string.mail.query[keys.scanner][keys.type.mail];

        const getListRequest = (pageToken) => {
            return gapi.client.gmail.users.messages.list({
                "userId": "me",
                "q": query,
                "pageToken": pageToken
            });
        };

        const requestListHandler = (response) => {
            if (response.result.messages) list = list.concat(response.result.messages);
            if (response.result.nextPageToken) {
                let request = getListRequest(response.result.nextPageToken);
                request.execute(requestListHandler);
            } else {
                for (let i = list.length - 1; i >= 0; i--) {
                    for (let mailId of process._ignoreMailIdList) {
                        if (list[i].id === mailId) {
                            list.splice(i, 1);
                            break;
                        }
                    }
                }
                processMailList(list);
            }
        };

        const processMailList = (list) => {
            process.status.list += 1;
            ui.progressBar.buffer = process.status.list / 6;
            process.status.total += list.length;

            const checkFinish = () => {
                if (process.status.list === 6 && process.status.total === process.status.finished) process.display();
            };

            checkFinish();

            for (let i = 0; i < list.length; i++) {
                let request = gapi.client.gmail.users.messages.get({
                    "userId": "me",
                    "id": list[i].id,
                    "format": "full",
                    "metadataHeaders": ["Subject"]
                });
                request.execute((fullMail) => {
                    process.portalList.push(process.parse.mail(fullMail, keys));
                    process.status.finished += 1;
                    ui.progressBar.progress = process.status.finished / process.status.total;
                    checkFinish();
                });
            }
        };

        // Begin
        let list = [];
        let request = getListRequest(null);
        request.execute(requestListHandler);
    },
    parse: {
        mail: (fullMail, keys) => {
            let portal = {};
            if (keys.type === value.string.key.type.confirmation) {
                portal.confirmedTime = parseInt(fullMail.internalDate);
                portal.status = value.code.portalStatus.pending;
                portal.confirmationMailId = fullMail.id;
            } else {
                portal.resultTime = parseInt(fullMail.internalDate);
                portal.status = value.code.portalStatus.accepted;
                portal.resultMailId = fullMail.id;
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
        rejectedReason: (mailBody, scanner) => {
            let mainBody = mailBody.slice(0, mailBody.search("-NianticOps"));
            let reason = value.code.portalStatus.rejected.undeclared;
            for (let key of Object.keys(value.string.mail.keyword[scanner].rejectedReason)) {
                for (let keyword of value.string.mail.keyword[scanner].rejectedReason[key]) {
                    if (mainBody.search(keyword) > -1) {
                        reason = value.code.portalStatus.rejected[key];
                        break;
                    }
                }
                if (reason !== value.code.portalStatus.rejected.undeclared) break;
            }
            return reason;
        },
        lngLat: (mailBody) => {
            let intel = mailBody.slice(mailBody.search(value.string.path.intel));
            intel = intel.slice(0, intel.search("\">"));
            let lngLatPair = intel.slice(intel.search("ll=") + 3, intel.search("&z=18")).split(",");
            return {
                lng: parseFloat(lngLatPair[1]),
                lat: parseFloat(lngLatPair[0])
            };
        },
    },
    display: () => {
        console.log("Display()");
        // Merge duplicated portals
        for (let i = process.portalList.length - 1; i >= 0; i--) {
            let portal = process.portalList[i];

            for (let j = 0; j < i; j++) {
                if (portal.id !== process.portalList[j].id) continue;
                let targetPortal = process.portalList[j];
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

        const getDateString = function(time) {
            const date = new Date();
            date.setTime(time);
            return date.toLocaleDateString();
        };

        const getIntervalString = (start, end) => {
            const day = Math.floor((end - start) / (24 * 3600 * 1000));
            return day + " day" + (day > 2 ? "s" : "");
        }

        let fillLngLatInfo = function(portal, card) {
            const iconDiv = document.createElement("div");
            iconDiv.className = "map-marker";
            const icon = document.createElement("span");
            icon.className = "material-icons";
            switch (portal.status) {
                case value.code.portalStatus.pending:
                    iconDiv.className += " status-pending-bg";
                    icon.innerHTML = "access_time";
                    break;
                case value.code.portalStatus.accepted:
                    iconDiv.className += " status-accepted-bg";
                    icon.innerHTML = "check";
                    break;
                default:
                    switch (portal.status) {
                        case value.code.portalStatus.rejected.tooClose:
                            icon.innerHTML = "compare_arrows";
                            break;
                        case value.code.portalStatus.rejected.duplicated:
                            icon.innerHTML = "filter_none";
                            break;
                        default:
                            icon.innerHTML = "close";
                            break;
                    }
                    iconDiv.className += " status-rejected-bg";
                    break;
            }
            iconDiv.appendChild(icon);
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
            card.getElementById("cardConfirmedTime").innerHTML = getDateString(portal.confirmedTime);
            if (portal.resultTime) {
                card.getElementById("cardInterval").innerHTML = getIntervalString(portal.confirmedTime, portal.resultTime);
                card.getElementById("cardResultTime").innerHTML = getDateString(portal.resultTime);
            } else {
                card.getElementById("cardInterval").innerHTML = getIntervalString(portal.confirmedTime, new Date().getTime());
                card.getElementById("cardResultBox").hidden = true;
            }
            const resultIcon        = card.getElementById("cardResultIcon");
            const statusButton      = card.getElementById("cardStatusButton");
            const statusButtonIcon  = card.getElementById("cardStatusButtonIcon");
            const statusButtonLabel = card.getElementById("cardStatusButtonLabel");

            switch (portal.status) {
                case value.code.portalStatus.pending:
                    statusButton.className += " status-pending";
                    statusButtonIcon.innerHTML = "access_time";
                    statusButtonLabel.innerHTML = "Pending";
                    classifiedList.pending.push(portal);
                    break;
                case value.code.portalStatus.accepted:
                    resultIcon.innerHTML = "check";
                    statusButton.className += " status-accepted";
                    statusButtonIcon.innerHTML = "check";
                    statusButtonLabel.innerHTML = "Accepted";
                    classifiedList.accepted.push(portal);
                    break;
                default:
                    switch (portal.status) {
                        case value.code.portalStatus.rejected.tooClose:
                            statusButtonIcon.innerHTML = "compare_arrows";
                            statusButtonLabel.innerHTML = "Too Close";
                            classifiedList.rejectedReason.tooClose.push(portal);
                            break;
                        case value.code.portalStatus.rejected.duplicated:
                            statusButtonIcon.innerHTML = "filter_none";
                            statusButtonLabel.innerHTML = "Duplicated";
                            classifiedList.rejectedReason.duplicated.push(portal);
                            break;
                        default:
                            statusButtonIcon.innerHTML = "close";
                            statusButtonLabel.innerHTML = "Rejected";
                            classifiedList.rejectedReason.undeclared.push(portal);
                            break;
                    }
                    statusButton.className += " status-rejected";
                    resultIcon.innerHTML = "close";
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
                card.getElementById("cardLocationButton").hidden = true;
                card.getElementById("cardIntelButton").hidden = true;
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
        ui.status.filter.rejected.switch.listen("change", (_) => ui.event.changeShow(classifiedList.rejected, ui.status.filter.rejected.switch.checked));
        ui.status.filter.pending.label.innerHTML  = getCountString(classifiedList.pending);
        ui.status.filter.pending.switch.listen("change", (_) => ui.event.changeShow(classifiedList.pending, ui.status.filter.pending.switch.checked));

        for (let key of Object.keys(classifiedList.rejectedReason)) {
            const portals = classifiedList.rejectedReason[key];
            ui.status.filter[key].label.innerHTML = getRejectedCountString(portals);
            ui.status.filter[key].switch.listen("change", (_) => ui.event.changeShow(portals, ui.status.filter[key].switch.checked));
        }
        for (let key of Object.keys(ui.status.block)) ui.status.block[key].hidden = false;

        const onFinished = function() {
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
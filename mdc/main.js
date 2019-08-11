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
        redacted: {
            confirmation: { total: -1, finished: 0, },
            acceptance:   { total: -1, finished: 0, },
            rejection:    { total: -1, finished: 0, },
        },
        prime: {
            confirmation: { total: -1, finished: 0, },
            acceptance:   { total: -1, finished: 0, },
            rejection:    { total: -1, finished: 0, },
        },
        clear: function() {
            for (let scanner of Object.keys(this)) {
                for (let type of Object.keys(this[scanner])) {
                    this[scanner][type].total = -1;
                    this[scanner][type].finished = 0;
                }
            }
        },
        all: function() {
            for (let scanner of Object.keys(this))
                for (let type of Object.keys(this[scanner]))
                    if (this[scanner][type].total < 0 || this[scanner][type].finished < this[scanner][type].total) return false;
            return true;
        },
        progress: function() {
            let count = 0;
            let finished = 0;
            for (let scanner of Object.keys(this)) {
                for (let type of Object.keys(this[scanner])) {
                    count += this[scanner][type].total < 0 ? 0 : this[scanner][type].total;
                    finished += this[scanner][type].finished;
                }
            }
            return finished / count;
        },
        bufferProgress: function() {
            let finished = 0;
            for (let scanner of Object.keys(this)) {
                for (let type of Object.keys(this[scanner])) {
                    finished += this[scanner][type].total < 0 ? 0 : 1;
                }
            }
            return finished / 6;
        }
    },
    start: () => {
        ui.init();
        process.status.clear();
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

        //fileKit.googleDrive.getFile(onGetFileFinished);
        onGetFileFinished();
        
    },
    mails: (keys) => {
        console.log("START");
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
            process.status[keys.scanner][keys.type.mail].total = list.length;

            const checkFinish = () => { if (process.status.all()) process.display(); };

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
                    process.status[keys.scanner][keys.type.mail].finished += 1;
                    ui.progressBar.buffer = process.status.bufferProgress();
                    ui.progressBar.progress = process.status.progress();
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
    display: function() {
        // Merge duplicated portals
        console.log("YEAH~~~");
        console.log(this.portalList);
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

        ui.control.received.row.hidden = false;
        ui.control.received.progress.cell.hidden = true;
        ui.control.received.count.innerHTML = process.portalList.length;

        for (let key of Object.keys(ui.control.portals)) {
            ui.control.portals[key].row.hidden = false;
            if (ui.control.portals[key].progress) {
                ui.control.portals[key].progress.cell.hidden = true;
            }
        }

        // Sort by time
        process.portalList.sort(function(a, b) {
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
        for (let i = 0; i < process.portalList.length; i++) {
            let portal = process.portalList[i];
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

        let getCountString = (list) => list.length === 0 ? "0 (0%)" : (list.length + " (" + (list.length / process.portalList.length * 100).toFixed(2) + "%)");

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
            ui.button.saveFile.root_.hidden = false;
            ui.button.uploadFile.root_.hidden = !gapi.auth2.getAuthInstance().isSignedIn.get();
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
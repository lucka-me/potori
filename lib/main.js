const ui = {
    button: {
        auth: document.getElementById("buttonAuth"),
        signout: document.getElementById("buttonSignout"),
    },
    control: {
        status: document.getElementById("controlStatus"),
        collapseAll: document.getElementById("controlCollapseAll"),
        received: {
            row: document.getElementById("controlReceivedRow"),
            count: document.getElementById("controlReceivedCount"),
        },
        portals: {
            accepted: {
                row: document.getElementById("controlAcceptedRow"),
                count: document.getElementById("controlAcceptedCount"),
                checkShow: document.getElementById("controlAcceptedCheckShow"),
            },
            rejected: {
                row: document.getElementById("controlRejectedRow"),
                count: document.getElementById("controlRejectedCount"),
                checkShow: document.getElementById("controlRejectedCheckShow"),
            },
            rejectedReason: {
                row: document.getElementById("controlRejectedReasonAllRow"),
                collapse: document.getElementById("controlCollapseRejectedReasonAll"),
                checkShow: document.getElementById("controlRejectedCheckShow"),
                reasons: {
                    undeclared: {
                        row: document.getElementById("controlRejectedReasonUndeclaredRow"),
                        count: document.getElementById("controlRejectedReasonUndeclaredCount"),
                        checkShow: document.getElementById("controlRejectedReasonUndeclaredCheckShow"),
                    },
                    duplicated: {
                        row: document.getElementById("controlRejectedReasonDuplicatedRow"),
                        count: document.getElementById("controlRejectedReasonDuplicatedCount"),
                        checkShow: document.getElementById("controlRejectedReasonDuplicatedCheckShow"),
                    },
                    tooClose: {
                        row: document.getElementById("controlRejectedReasonTooCloseRow"),
                        count: document.getElementById("controlRejectedReasonTooCloseCount"),
                        checkShow: document.getElementById("controlRejectedReasonTooCloseCheckShow"),
                    },
                }
            },
            pending: {
                row: document.getElementById("controlPendingRow"),
                count: document.getElementById("controlPendingCount"),
                checkShow: document.getElementById("controlPendingCheckShow"),
            }
        },
    },
    map: {
        mapCtrl: null,
        load: function() {
            mapboxgl.accessToken = value.string.mapbox.accessToken;
            ui.map.mapCtrl = new mapboxgl.Map({ container: "map", style: value.string.mapbox.style });
        },
        easeTo: function(lngLat) { ui.map.mapCtrl.easeTo({ center: lngLat, zoom: 16 }); },
    },
    cardList: document.getElementById("cardList"),
};

var mailList = {
    confirmation: null,
    acceptance: null,
    rejection: null,
}

var portalList = {
    accepted: [],
    rejected: [],
    pending: [],
    rejectedReason: {
        undeclared: [],
        duplicated: [],
        tooClose: [],
    }
}

/* BEGIN: Google Auth */

function handleClientLoad() { gapi.load("client:auth2", initClient); }

function initClient() {
    gapi.client.init(value.string.gapiOptions).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateAuthStatus);
        // Handle the initial sign-in state.
        updateAuthStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        ui.button.auth.onclick = function(event) { gapi.auth2.getAuthInstance().signIn(); };
        ui.button.signout.onclick = function(event) { gapi.auth2.getAuthInstance().signOut(); };
    }, function(error) {
        alert(JSON.stringify(error, null, 2));
    });
}

function updateAuthStatus(isSignedIn) {
    if (isSignedIn) {
        ui.button.auth.hidden = true;
        ui.button.signout.hidden = false;
        processChecking();
    } else {
        ui.button.auth.hidden = false;
        ui.button.signout.hidden = true;
        ui.control.status.innerHTML = "Please authorize first."
        ui.control.received.row.hidden = true;
        for (let key of Object.keys(ui.control.portals)) {
            ui.control.portals[key].row.hidden = true;
            ui.control.portals[key].checkShow.disabled = true;
        }
        mailList.confirmation = null;
        mailList.acceptance = null;
        mailList.rejection = null;
        ui.cardList.innerHTML = "";
    }
}

/* END: Google Auth */

/* BEGIN: Process Mails */

function processChecking() {
    // Get confirmation mails
    ui.control.status.innerHTML = "Processing mails...";
    requestConfirmationMailList();
    requestAcceptanceMailList();
    requestRejectionMailList();
}

function getListRequest(query, pageToken) {
    return gapi.client.gmail.users.messages.list({
        "userId": "me",
        "q": query,
        "pageToken": pageToken
    });
};

function requestConfirmationMailList() {
    ui.control.received.row.hidden = false;
    ui.control.received.count.innerHTML = "Loading...";
    requestMailList(
        value.string.query.redacted.confirmation,
        function(messages) {
            mailList.confirmation = messages;
            ui.control.received.count.innerHTML = mailList.confirmation.length;
            processConfirmationMails();
        }
    )
}

function requestAcceptanceMailList() {
    ui.control.portals.accepted.row.hidden = false;
    ui.control.portals.accepted.count.innerHTML = "Loading...";
    requestMailList(
        value.string.query.redacted.acceptance,
        function(messages) {
            mailList.acceptance = messages;
            ui.control.portals.accepted.count.innerHTML = mailList.acceptance.length;
            processAcceptanceMails();
        }
    )
}

function requestRejectionMailList() {
    ui.control.portals.rejected.row.hidden = false;
    ui.control.portals.rejected.count.innerHTML = "Loading...";
    requestMailList(
        value.string.query.redacted.rejection,
        function(messages) {
            mailList.rejection = messages;
            ui.control.portals.rejected.count.innerHTML = mailList.rejection.length;
            processRejectionMails();
        }
    )
}

function requestMailList(query, callback) {
    var messages = [];
    var requestHandler = function(response) {
        messages = messages.concat(response.result.messages);
        if (response.result.nextPageToken) {
            var request = getListRequest(query, response.result.nextPageToken);
            request.execute(requestHandler);
        } else {
            callback(messages);
            if (mailList.confirmation && mailList.acceptance && mailList.rejection) {
                pendingMailCount = mailList.confirmation.length - mailList.acceptance.length - mailList.rejection.length;
                ui.control.portals.pending.row.hidden = false;
                ui.control.portals.pending.count.innerHTML = pendingMailCount;
            }
        }
    };
    var request = getListRequest(query, null);
    request.execute(requestHandler);
}

function processConfirmationMails() {
    portalList.pending = [];
    ui.control.received.count.innerHTML = "0/" + mailList.confirmation.length;
    processMails(
        mailList.confirmation, portalList.pending,
        function(length) {
            ui.control.received.count.innerHTML = length + "/" + mailList.confirmation.length;
        }
    );
}

function processAcceptanceMails() {
    portalList.accepted = [];
    ui.control.portals.accepted.count.innerHTML = "0/" + mailList.acceptance.length;
    processMails(
        mailList.acceptance, portalList.accepted,
        function(length) {
            ui.control.portals.accepted.count.innerHTML = length + "/" + mailList.acceptance.length;
        },
        getIntelAndLngLat
    );
}

function processRejectionMails() {
    portalList.rejected = [];
    portalList.rejectedReason.undeclared = [];
    portalList.rejectedReason.duplicated = [];
    portalList.rejectedReason.tooClose = [];
    ui.control.portals.rejected.count.innerHTML = "0/" + mailList.rejection.length;
    processMails(
        mailList.rejection, portalList.rejected,
        function(length) {
            ui.control.portals.rejected.count.innerHTML = length + "/" + mailList.rejection.length;
        },
        function(mailBody, portal) {
            getIntelAndLngLat(mailBody, portal);
            if (mailBody.search("too close to an existing Portal") > -1) {
                portal.rejectedReason = 1;
            } else if (mailBody.search("duplicate of either an existing Portal") > -1) {
                portal.rejectedReason = 2;
            } else {
                portal.rejectedReason = 0;
            }
        }
    );
}

function processMails(mailList, portalList, finishSingleCallback, additionalProcessForMailBody) {
    for (var i = 0; i < mailList.length; i++) {
        var request = gapi.client.gmail.users.messages.get({
            "userId": "me",
            "id": mailList[i].id,
            "format": "full",
            "metadataHeaders": ["Subject"]
        });
        request.execute(function(fullMail) {
            portalList.push(parseFullMail(fullMail, additionalProcessForMailBody));
            finishSingleCallback(portalList.length);
            if (portalList.length == mailList.length) checkToDisplayPortals();
        });
    }
}

function parseFullMail(fullMail, additionalProcessForMailBody) {
    var portal = { name: "", url: "", time: fullMail.internalDate };
    for (var i = 0; i < fullMail.payload.headers.length; i++) {
        var header = fullMail.payload.headers[i];
        if (header.name === "Subject") {
            portal.name = header.value.replace("Portal submission confirmation: ", "").replace("Portal review complete: ", "");
            break;
        }
    }
    for (var i = 0; i < fullMail.payload.parts.length; i++) {
        var part = fullMail.payload.parts[i];
        if (part.partId == 1) {
            // Decode base64
            // Ref: https://nelluil.postach.io/post/btoa-atob-zhi-yuan-zhong-wen-de-fang-fa
            // Ref: https://cnodejs.org/topic/4fd6b7ba839e1e581407aac8
            var mailBody = unescape(decodeURIComponent(escape(window.atob(part.body.data.replace(/\-/g, "+").replace(/\_/g, "/")))));
            portal.url = mailBody.slice(
                mailBody.search(/googleusercontent\.com/),
                mailBody.search(/\" alt\=\"Portal /)
            ).replace("googleusercontent.com/", "");
            portal.bsId = getBsId(portal.url);
            if (additionalProcessForMailBody) {
                additionalProcessForMailBody(mailBody, portal);
            }
            break;
        }
    }
    return portal;
}

function getBsId(imgUrl) { return imgUrl.replace(/[^a-zA-Z0-9]/g, "").slice(- 10).toLowerCase(); }

function getIntelAndLngLat(mailBody, portal) {
    var intelTemp = mailBody.slice(mailBody.search(value.string.path.intel));
    portal.intel = intelTemp.slice(0, intelTemp.search("\">"));
    var lngLatPair = portal.intel.slice(portal.intel.search("ll=") + 3, portal.intel.search("&z=18")).split(",");
    portal.lngLat = {
        lon: parseFloat(lngLatPair[1]),
        lat: parseFloat(lngLatPair[0])
    };
}

/* END: Process Mails */

/* BEGIN: Display Portals */

function checkToDisplayPortals() {
    if (mailList.confirmation == null || mailList.confirmation.length != portalList.pending.length ||
        mailList.acceptance.length != portalList.accepted.length ||
        mailList.rejection.length != portalList.rejected.length
    ) return;
    displayPortals();
}

function displayPortals() {
    // Remove the accepted and rejected portals from pending list
    for (var i = portalList.pending.length - 1; i >= 0; i--) {
        var shouldRemove = false;

        for (var j = 0; j < portalList.accepted.length; j++) {
            if (portalList.accepted[j].url === portalList.pending[i].url) {
                portalList.accepted[j].confirmedTime = portalList.pending[i].time;
                shouldRemove = true;
                break;
            }
        }
        if (shouldRemove) {
            portalList.pending.splice(i, 1);
            continue;
        }

        for (var j = 0; j < portalList.rejected.length; j++) {
            if (portalList.rejected[j].url === portalList.pending[i].url) {
                portalList.rejected[j].confirmedTime = portalList.pending[i].time;
                shouldRemove = true;
                break;
            }
        }
        if (shouldRemove) {
            portalList.pending.splice(i, 1);
        } else {
            portalList.pending[i].confirmedTime = portalList.pending[i].time;
        }
    }

    let boundsNE = { lon: -181.0, lat: -91.0 };
    let boundsSW = { lon: 181.0, lat: 91.0 };

    let extendBounds = function(lngLat, boundsNE, boundsSW) {
        if (lngLat.lon > boundsNE.lon) boundsNE.lon = lngLat.lon;
        else if (lngLat.lon < boundsSW.lon) boundsSW.lon = lngLat.lon;
        if (lngLat.lat > boundsNE.lat) boundsNE.lat = lngLat.lat;
        else if (lngLat.lat < boundsSW.lat) boundsSW.lat = lngLat.lat;
    }

    for (var i = 0; i < portalList.accepted.length; i++) {
        var portal = portalList.accepted[i];
        var newCard = document.getElementById("templateCard").content.cloneNode(true);
        fillCardBasic(newCard, portal);
        newCard.getElementById("statusIconSpan").className = "fa-stack status-accepted";
        newCard.getElementById("statusIconStack").className = "fas fa-check fa-stack-1x fa-inverse";
        newCard.getElementById("portalFinalIcon").className = value.string.css.finalIcon.accepted;
        fillCardFinal(newCard, portal, newCard.getElementById("statusIconStackDiv").cloneNode(true));
        ui.cardList.appendChild(newCard);
        portal.cardItem = document.getElementById("card_" + portal.bsId).parentNode;
        portal.cardItem.id = "item_" + portal.bsId;
        extendBounds(portal.lngLat, boundsNE, boundsSW);
    }

    for (var i = 0; i < portalList.pending.length; i++) {
        var portal = portalList.pending[i];
        var newCard = document.getElementById("templateCard").content.cloneNode(true);
        fillCardBasic(newCard, portal);
        newCard.getElementById("statusIconSpan").className = "fa-stack status-pending";
        newCard.getElementById("statusIconStack").className = "fas fa-ellipsis-h fa-stack-1x fa-inverse";
        newCard.getElementById("portalTitle").innerHTML = portal.name;
        newCard.getElementById("portalInterval").innerHTML = Math.floor((new Date().getTime() - portal.confirmedTime) / (24 * 3600 * 1000)) + " days"
        newCard.getElementById("portalFinalBox").hidden = true;
        ui.cardList.appendChild(newCard);
        portal.cardItem = document.getElementById("card_" + portal.bsId).parentNode;
        portal.cardItem.id = "item_" + portal.bsId;
    }

    for (var i = 0; i < portalList.rejected.length; i++) {
        var portal = portalList.rejected[i];
        var newCard = document.getElementById("templateCard").content.cloneNode(true);
        fillCardBasic(newCard, portal);
        var statusIconStack = newCard.getElementById("statusIconStack");
        switch (portal.rejectedReason) {
            case 1:
                statusIconStack.className = value.string.css.statusIcon.rejectedReason.tooClose;
                statusIconStack.title = "Too close";
                portalList.rejectedReason.tooClose.push(portal);
                break;
            case 2:
                statusIconStack.className = value.string.css.statusIcon.rejectedReason.duplicated;
                statusIconStack.title = "Duplicated";
                portalList.rejectedReason.duplicated.push(portal);
                break;
            default:
                statusIconStack.className = value.string.css.statusIcon.rejectedReason.undeclared;
                statusIconStack.title = "Undeclared";
                portalList.rejectedReason.undeclared.push(portal);
                break;
        }
        newCard.getElementById("portalFinalIcon").className = value.string.css.finalIcon.rejected;
        fillCardFinal(newCard, portal, newCard.getElementById("statusIconStackDiv").cloneNode(true));
        ui.cardList.appendChild(newCard);
        portal.cardItem = document.getElementById("card_" + portal.bsId).parentNode;
        portal.cardItem.id = "item_" + portal.bsId;
        extendBounds(portal.lngLat, boundsNE, boundsSW);
    }

    if (boundsNE.lon > -180 && boundsNE.lat > -90 && boundsSW.lon < 180 && boundsSW.lat < 90) {
        ui.map.mapCtrl.fitBounds([boundsSW, boundsNE], {
            padding: 16,
            linear: true
        });
    }
    
    ui.control.status.innerHTML = "Process finished.";

    ui.control.portals.accepted.count.innerHTML = portalList.accepted.length == 0 ? "0/0(0%)" : (portalList.accepted.length + "/" + portalList.accepted.length + "(" + (portalList.accepted.length / mailList.confirmation.length * 100).toFixed(2) + "%)");
    ui.control.portals.rejected.count.innerHTML = portalList.rejected.length == 0 ? "0/0(0%)" : (portalList.rejected.length + "/" + portalList.rejected.length + "(" + (portalList.rejected.length / mailList.confirmation.length * 100).toFixed(2) + "%)");
    ui.control.portals.pending.count.innerHTML = portalList.pending.length == 0 ? "0/0(0%)" : (portalList.pending.length + "/" + portalList.pending.length + "(" + (portalList.pending.length / mailList.confirmation.length * 100).toFixed(2) + "%)");

    let initCheckBox = function(target, portals) {
        target.disabled = false;
        target.onchange = function() { changeShow(portals, target.checked); };
    };

    for (const key of Object.keys(portalList.rejectedReason)) {
        var portals = portalList.rejectedReason[key];
        if (portals.length < 1) return;
        var count = portalList.rejectedReason[key].length;
        ui.control.portals.rejectedReason.reasons[key].count.innerHTML = count + "(" + (count / portalList.rejected.length * 100).toFixed(2) + "%)";
        initCheckBox(ui.control.portals.rejectedReason.reasons[key].checkShow, portals);
    }
    if (portalList.rejected.length > 0) {
        ui.control.portals.rejectedReason.row.hidden = false;
        ui.control.portals.rejectedReason.collapse.style.display = "inline";
    }

    if (portalList.accepted.length > 0) {
        initCheckBox(ui.control.portals.accepted.checkShow, portalList.accepted);
    }
    if (portalList.rejected.length > 0) {
        initCheckBox(ui.control.portals.rejected.checkShow, portalList.rejected);
        ui.control.portals.rejected.checkShow.disabled = false;
        ui.control.portals.rejected.checkShow.onchange = function() {
            var checked = ui.control.portals.rejected.checkShow.checked;
            for (const key of Object.keys(ui.control.portals.rejectedReason.reasons)) {
                ui.control.portals.rejectedReason.reasons[key].checkShow.checked = checked;
            }
            changeShow(portalList.rejected, checked);
        };
    }
    if (portalList.pending.length > 0) {
        initCheckBox(ui.control.portals.pending.checkShow, portalList.pending);
    }
    ui.control.collapseAll.style.display = "inline";
}

function getDateString(time) {
    var date = new Date();
    date.setTime(time);
    return date.toLocaleDateString();
}

function fillCardBasic(card, portal) {
    card.getElementById("card").id = "card_" + portal.bsId;
    card.getElementById("bsLink").href = value.string.path.bsWatermeter + portal.bsId;
    card.getElementById("portalImg").src = value.string.path.image + portal.url;
    card.getElementById("portalConfirmedTime").innerHTML = getDateString(portal.confirmedTime);
}

function fillCardFinal(card, portal, iconElement) {
    card.getElementById("card_" + portal.bsId).onclick = function() { ui.map.easeTo(portal.lngLat); };
    card.getElementById("portalTitle").hidden = true;
    card.getElementById("portalTitleLink").innerHTML = portal.name;
    card.getElementById("portalTitleLink").href = portal.intel;
    card.getElementById("portalTitleLink").hidden = false;
    card.getElementById("portalInterval").innerHTML = Math.floor((portal.time - portal.confirmedTime) / (24 * 3600 * 1000)) + " days"
    card.getElementById("portalFinalTime").innerHTML = getDateString(portal.time);
    
    iconElement.onclick = function() { scrollToCard(portal); };
    portal.marker = new mapboxgl.Marker({ element: iconElement })
        .setLngLat(portal.lngLat)
        .setPopup(new mapboxgl.Popup({ closeButton: false }).setText(portal.name))
        .addTo(ui.map.mapCtrl);
}

/* END: Display Portals */

/* BEGIN: Events for Cards and Markers */
function scrollToCard(portal) {
    ui.cardList.scrollTo(0, portal.cardItem.offsetTop - ui.cardList.offsetTop - 8);
}

/* END: Events for Cards and Markers */

/* BEGIN: Events for Control */
function changeShow(portalList, show) {
    if (show) {
        for (var i = 0; i < portalList.length; i++) {
            var portal = portalList[i];
            if (portal.marker) portal.marker.addTo(ui.map.mapCtrl);
            portal.cardItem.style.display = "flex";
        }
    } else {
        for (var i = 0; i < portalList.length; i++) {
            var portal = portalList[i];
            if (portal.marker) portal.marker.remove();
            portal.cardItem.style.display = "none";
        }
    }
}

function onClickCollapseAll() {
    var isHidden = ui.control.pending.row.hidden;
    for (let key in Object.keys(ui.control.portals.rejectedReason.reasons)) {
        ui.control.portals.rejectedReason.reasons[key].row.hidden = !isHidden;
    }
    if (portalList.rejected.length > 0) ui.control.portals.rejectedReason.row.hidden = !isHidden;
    reverseAngle(ui.control.collapseAll, isHidden);
}

function onClickCollapseRejectedReason() {
    var isHidden = true;
    for (let key of Object.keys(ui.control.portals.rejectedReason.reasons)) {
        if (!ui.control.portals.rejectedReason.reasons[key].row.hidden) {
            isHidden = false;
            break;
        }
    }
    for (let key of Object.keys(ui.control.portals.rejectedReason.reasons)) {
        ui.control.portals.rejectedReason.reasons[key].row.hidden = !isHidden;
    }
    reverseAngle(ui.control.portals.rejectedReason.collapse, isHidden);
}

function reverseAngle(element, wasHidden) {
    if (wasHidden) {
        element.className = value.string.css.collapse.up;
    } else {
        element.className = value.string.css.collapse.down;
    }
}

/* END: Events for Control */
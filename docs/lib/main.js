var map;

var authButton = document.getElementById("buttonAuth");
var signoutButton = document.getElementById("buttonSignout");

var control = {
    status: document.getElementById("controlStatus"),
    row: {
        received: document.getElementById("controlReceivedRow"),
        accepted: document.getElementById("controlAcceptedRow"),
        rejected: document.getElementById("controlRejectedRow"),
        rejectedReasonAll: document.getElementById("controlRejectedReasonAllRow"),
        pending: document.getElementById("controlPendingRow"),
        rejectedReason: {
            undeclared: document.getElementById("controlRejectedReasonUndeclaredRow"),
            duplicated: document.getElementById("controlRejectedReasonDuplicatedRow"),
            tooClose: document.getElementById("controlRejectedReasonTooCloseRow"),
        }
    },
    count: {
        received: document.getElementById("controlReceivedCount"),
        accepted: document.getElementById("controlAcceptedCount"),
        rejected: document.getElementById("controlRejectedCount"),
        pending: document.getElementById("controlPendingCount"),
        rejectedReason: {
            undeclared: document.getElementById("controlRejectedReasonUndeclaredCount"),
            duplicated: document.getElementById("controlRejectedReasonDuplicatedCount"),
            tooClose: document.getElementById("controlRejectedReasonTooCloseCount"),
        },
    },
    checkShow: {
        accepted: document.getElementById("controlAcceptedCheckShow"),
        rejected: document.getElementById("controlRejectedCheckShow"),
        pending: document.getElementById("controlPendingCheckShow"),
        rejectedReason: {
            undeclared: document.getElementById("controlRejectedReasonUndeclaredCheckShow"),
            duplicated: document.getElementById("controlRejectedReasonDuplicatedCheckShow"),
            tooClose: document.getElementById("controlRejectedReasonTooCloseCheckShow"),
        },
    },
    collapse: {
        all: document.getElementById("controlCollapseAll"),
        rejectedReasonAll: document.getElementById("controlCollapseRejectedReasonAll"),
    }
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

var cardList = document.getElementById("cardList");

var imagePath = "https://lh3.googleusercontent.com/";
var bsWatermeterPath = "http://kitten-114.getforge.io/watermeter.html#";

function loadMap() {
    mapboxgl.accessToken = "pk.eyJ1IjoibHVja2EtbWUiLCJhIjoiY2p2NDk5NmRvMHFreTQzbzduemM1MHV4cCJ9.7XGmxnEJRoCDr-i5BBmBfw";
    map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11"
    });
}

/* BEGIN: Google Auth */

function handleClientLoad() {
    gapi.load("client:auth2", initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: "AIzaSyBTuRN1Vs4bV9A3oZA1ksZsdDpS5eiLB1M",
        clientId: "326067800963-49a04e410n6k156go9jk38916p1e5b7b.apps.googleusercontent.com",
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
        scope: "https://www.googleapis.com/auth/gmail.readonly"
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateAuthStatus);
        // Handle the initial sign-in state.
        updateAuthStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        alert(JSON.stringify(error, null, 2));
    });
}

function updateAuthStatus(isSignedIn) {
    if (isSignedIn) {
        authButton.hidden = true;
        signoutButton.hidden = false;
        processChecking();
    } else {
        authButton.hidden = false;
        signoutButton.hidden = true;
        control.status.innerHTML = "Please authorize first."
        control.status.hidden = false;
        control.row.received.hidden = true;
        control.row.accepted.hidden = true;
        control.row.rejected.hidden = true;
        control.row.pending.hidden = true;
        control.checkShow.accepted.disabled = true;
        control.checkShow.rejected.disabled = true;
        control.checkShow.pending.disabled = true;
        mailList.confirmation = null;
        mailList.acceptance = null;
        mailList.rejection = null;
        cardList.innerHTML = "";
    }
}

function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/* END: Google Auth */

/* BEGIN: Process Mails */

function processChecking() {
    // Get confirmation mails
    control.status.innerHTML = "Processing mails...";
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
    control.row.received.hidden = false;
    control.count.received.innerHTML = "Loading...";
    requestMailList(
        "from:ingress-support@nianticlabs.com Portal submission confirmation -edit -photo",
        function(messages) {
            mailList.confirmation = messages;
            control.count.received.innerHTML = mailList.confirmation.length;
            processConfirmationMails();
        }
    )
}

function requestAcceptanceMailList() {
    control.row.accepted.hidden = false;
    control.count.accepted.innerHTML = "Loading...";
    requestMailList(
        "from:ingress-support@nianticlabs.com Portal review complete now available -edit -photo",
        function(messages) {
            mailList.acceptance = messages;
            control.count.accepted.innerHTML = mailList.acceptance.length;
            processAcceptanceMails();
        }
    )
}

function requestRejectionMailList() {
    control.row.rejected.hidden = false;
    control.count.rejected.innerHTML = "Loading...";
    requestMailList(
        "from:ingress-support@nianticlabs.com Portal review complete reviewed -edit -photo",
        function(messages) {
            mailList.rejection = messages;
            control.count.rejected.innerHTML = mailList.rejection.length;
            processRejectionMails();
        }
    )
}

function requestMailList(query, callback) {
    var messages = [];
    var requestHandler = function(response) {
        if (response.result.messages) messages = messages.concat(response.result.messages);
        if (response.result.nextPageToken) {
            var request = getListRequest(query, response.result.nextPageToken);
            request.execute(requestHandler);
        } else {
            callback(messages);
            if (mailList.confirmation && mailList.acceptance && mailList.rejection) {
                pendingMailCount = mailList.confirmation.length - mailList.acceptance.length - mailList.rejection.length;
                control.row.pending.hidden = false;
                control.count.pending.innerHTML = pendingMailCount;
            }
        }
    };
    var request = getListRequest(query, null);
    request.execute(requestHandler);
}

function processConfirmationMails() {
    portalList.pending = [];
    control.count.received.innerHTML = "0/" + mailList.confirmation.length;
    processMails(
        mailList.confirmation, portalList.pending,
        function(length) {
            control.count.received.innerHTML = length + "/" + mailList.confirmation.length;
        }
    );
}

function processAcceptanceMails() {
    portalList.accepted = [];
    control.count.accepted.innerHTML = "0/" + mailList.acceptance.length;
    processMails(
        mailList.acceptance, portalList.accepted,
        function(length) {
            control.count.accepted.innerHTML = length + "/" + mailList.acceptance.length;
        },
        getIntelAndLngLat
    );
}

function processRejectionMails() {
    portalList.rejected = [];
    portalList.rejectedReason.undeclared = [];
    portalList.rejectedReason.duplicated = [];
    portalList.rejectedReason.tooClose = [];
    control.count.rejected.innerHTML = "0/" + mailList.rejection.length;
    processMails(
        mailList.rejection, portalList.rejected,
        function(length) {
            control.count.rejected.innerHTML = length + "/" + mailList.rejection.length;
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
    if (portalList.length == mailList.length) checkToDisplayPortals();
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

function getBsId(imgUrl) {
    return imgUrl.replace(/[^a-zA-Z0-9]/g, "").slice(- 10).toLowerCase();
}

function getIntelAndLngLat(mailBody, portal) {
    var intelTemp = mailBody.slice(mailBody.search("https://www.ingress.com/intel"));
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

    var cardList = document.getElementById("cardList");
    var boundsNE = { lon: -181.0, lat: -91.0 };
    var boundsSW = { lon: 181.0, lat: 91.0 };

    for (var i = 0; i < portalList.accepted.length; i++) {
        var portal = portalList.accepted[i];
        var newCard = document.getElementById("templateCard").content.cloneNode(true);
        fillCardBasic(newCard, portal);
        newCard.getElementById("statusIconSpan").className = "fa-stack status-accepted";
        newCard.getElementById("statusIconStack").className = "fas fa-check fa-stack-1x fa-inverse";
        newCard.getElementById("portalFinalIcon").className = "fas fa-check fa-fw";
        fillCardFinal(newCard, portal, newCard.getElementById("statusIconStackDiv").cloneNode(true));
        cardList.appendChild(newCard);
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
        cardList.appendChild(newCard);
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
                statusIconStack.className = "fas fa-arrows-alt-h fa-stack-1x fa-inverse";
                statusIconStack.title = "Too close";
                portalList.rejectedReason.tooClose.push(portal);
                break;
            case 2:
                statusIconStack.className = "fas fa-clone fa-stack-1x fa-inverse";
                statusIconStack.title = "Duplicated";
                portalList.rejectedReason.duplicated.push(portal);
                break;
            default:
                statusIconStack.className = "fas fa-times fa-stack-1x fa-inverse";
                statusIconStack.title = "Undeclared";
                portalList.rejectedReason.undeclared.push(portal);
                break;
        }
        newCard.getElementById("portalFinalIcon").className = "fas fa-times fa-fw";
        fillCardFinal(newCard, portal, newCard.getElementById("statusIconStackDiv").cloneNode(true));
        cardList.appendChild(newCard);
        portal.cardItem = document.getElementById("card_" + portal.bsId).parentNode;
        portal.cardItem.id = "item_" + portal.bsId;
        extendBounds(portal.lngLat, boundsNE, boundsSW);
    }

    if (boundsNE.lon > -180 && boundsNE.lat > -90 && boundsSW.lon < 180 && boundsSW.lat < 90) {
        map.fitBounds([boundsSW, boundsNE], {
            padding: 16,
            linear: true
        });
    }
    
    control.status.innerHTML = "Process finished.";

    control.count.accepted.innerHTML = portalList.accepted.length == 0 ? "0/0(0%)" : (portalList.accepted.length + "/" + portalList.accepted.length + "(" + (portalList.accepted.length / mailList.confirmation.length * 100).toFixed(2) + "%)");
    control.count.rejected.innerHTML = portalList.rejected.length == 0 ? "0/0(0%)" : (portalList.rejected.length + "/" + portalList.rejected.length + "(" + (portalList.rejected.length / mailList.confirmation.length * 100).toFixed(2) + "%)");
    control.count.pending.innerHTML = portalList.pending.length == 0 ? "0/0(0%)" : (portalList.pending.length + "/" + portalList.pending.length + "(" + (portalList.pending.length / mailList.confirmation.length * 100).toFixed(2) + "%)");

    var initCheckBox = function(target, portals) {
        target.disabled = false;
        target.onchange = function() { changeShow(portals, target.checked); };
    }

    for (const key of Object.keys(portalList.rejectedReason)) {
        var portals = portalList.rejectedReason[key];
        if (portals.length < 1) return;
        var count = portalList.rejectedReason[key].length;
        control.count.rejectedReason[key].innerHTML = count + "(" + (count / portalList.rejected.length * 100).toFixed(2) + "%)";
        initCheckBox(control.checkShow.rejectedReason[key], portals);
    }
    if (portalList.rejected.length > 0) {
        control.row.rejectedReasonAll.hidden = false;
        control.collapse.rejectedReasonAll.style.display = "inline";
    }

    if (portalList.accepted.length > 0) {
        initCheckBox(control.checkShow.accepted, portalList.accepted);
    }
    if (portalList.rejected.length > 0) {
        initCheckBox(control.checkShow.rejected, portalList.rejected);
        control.checkShow.rejected.disabled = false;
        control.checkShow.rejected.onchange = function() {
            var checked = control.checkShow.rejected.checked;
            for (const key of Object.keys(control.checkShow.rejectedReason)) {
                control.checkShow.rejectedReason[key].checked = checked;
            }
            changeShow(portalList.rejected, checked);
        };
    }
    if (portalList.pending.length > 0) {
        initCheckBox(control.checkShow.pending, portalList.pending);
    }
    control.collapse.all.style.display = "inline";
}

function extendBounds(lngLat, boundsNE, boundsSW) {
    if (lngLat.lon > boundsNE.lon) boundsNE.lon = lngLat.lon;
    else if (lngLat.lon < boundsSW.lon) boundsSW.lon = lngLat.lon;
    if (lngLat.lat > boundsNE.lat) boundsNE.lat = lngLat.lat;
    else if (lngLat.lat < boundsSW.lat) boundsSW.lat = lngLat.lat;
}

function getDateString(time) {
    var date = new Date();
    date.setTime(time);
    return date.toLocaleDateString();
}

function fillCardBasic(card, portal) {
    card.getElementById("card").id = "card_" + portal.bsId;
    card.getElementById("bsLink").href = bsWatermeterPath + portal.bsId;
    card.getElementById("portalImg").src = imagePath + portal.url;
    card.getElementById("portalConfirmedTime").innerHTML = getDateString(portal.confirmedTime);
}

function fillCardFinal(card, portal, iconElement) {
    card.getElementById("card_" + portal.bsId).onclick = function() { easeToMarker(portal.lngLat); };
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
        .addTo(map);
}

/* END: Display Portals */

/* BEGIN: Events for Cards and Markers */

function easeToMarker(lngLat) {
    map.easeTo({ center: lngLat, zoom: 16 });
}

function scrollToCard(portal) {
    var cardList = document.getElementById("cardList");
    cardList.scrollTo(0, portal.cardItem.offsetTop - cardList.offsetTop - 8);
}

/* END: Events for Cards and Markers */

/* BEGIN: Events for Control */
function changeShow(portalList, show) {
    if (show) {
        for (var i = 0; i < portalList.length; i++) {
            var portal = portalList[i];
            if (portal.marker) portal.marker.addTo(map);
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
    var isHidden = control.row.pending.hidden;
    control.row.accepted.hidden = !isHidden;
    control.row.rejected.hidden = !isHidden;
    control.row.pending.hidden = !isHidden;
    if (portalList.rejected.length > 0) control.row.rejectedReasonAll.hidden = !isHidden;
    reverseAngle(control.collapse.all, isHidden);
}

function onClickCollapseRejectedReason() {
    var isHidden = true;
    for (const rowName of Object.keys(control.row.rejectedReason)) {
        if (!control.row.rejectedReason[rowName].hidden) {
            isHidden = false;
            break;
        }
    }
    for (const rowName of Object.keys(control.row.rejectedReason)) {
        control.row.rejectedReason[rowName].hidden = !isHidden;
    }
    reverseAngle(control.collapse.rejectedReasonAll, isHidden);
}

function reverseAngle(element, wasHidden) {
    if (wasHidden) {
        element.className = "cursor-pointer fas fa-angle-double-up fa-fw";
    } else {
        element.className = "cursor-pointer fas fa-angle-double-down fa-fw";
    }
}

/* END: Events for Control */
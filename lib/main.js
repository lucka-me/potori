var map;

var authButton = document.getElementById("buttonAuth");
var signoutButton = document.getElementById("buttonSignout");

var psciStatus = document.getElementById("psciStatus");
var psciReceivedRow = document.getElementById("psciReceivedRow");
var psciAcceptedRow = document.getElementById("psciAcceptedRow");
var psciRejectedRow = document.getElementById("psciRejectedRow");
var psciPendingRow = document.getElementById("psciPendingRow");
var psciReceivedCount = document.getElementById("psciReceivedCount");
var psciAcceptedCount = document.getElementById("psciAcceptedCount");
var psciRejectedCount = document.getElementById("psciRejectedCount");
var psciPendingCount = document.getElementById("psciPendingCount");
var psciCheckShowAccepted = document.getElementById("psciCheckShowAccepted");
var psciCheckShowRejected = document.getElementById("psciCheckShowRejected");
var psciCheckShowPending = document.getElementById("psciCheckShowPending");

var mailConfirmationList = null;
var mailAcceptanceList = null;
var mailRejectionList = null;

var cardList = document.getElementById("cardList");
var portalPendingList = [];
var portalAcceptedList = [];
var portalRejectedList = [];

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
        psciStatus.innerHTML = "Please authorize first."
        psciStatus.hidden = false;
        psciReceivedRow.hidden = true;
        psciAcceptedRow.hidden = true;
        psciRejectedRow.hidden = true;
        psciPendingRow.hidden = true;
        psciCheckShowAccepted.disabled = true;
        psciCheckShowRejected.disabled = true;
        psciCheckShowPending.disabled = true;
        mailConfirmationList = null;
        mailAcceptanceList = null;
        mailRejectionList = null;
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
    psciStatus.innerHTML = "Processing mails...";
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
    psciReceivedRow.hidden = false;
    psciReceivedCount.innerHTML = "Loading...";
    requestMailList(
        "from:ingress-support@nianticlabs.com Portal submission confirmation -edit -photo",
        function(messages) {
            mailConfirmationList = messages;
            psciReceivedCount.innerHTML = mailConfirmationList.length;
            processConfirmationMails();
        }
    )
}

function requestAcceptanceMailList() {
    psciAcceptedRow.hidden = false;
    psciAcceptedCount.innerHTML = "Loading...";
    requestMailList(
        "from:ingress-support@nianticlabs.com Portal review complete now available -edit -photo",
        function(messages) {
            mailAcceptanceList = messages;
            psciAcceptedCount.innerHTML = mailAcceptanceList.length;
            processAcceptanceMails();
        }
    )
}

function requestRejectionMailList() {
    psciRejectedRow.hidden = false;
    psciRejectedCount.innerHTML = "Loading...";
    requestMailList(
        "from:ingress-support@nianticlabs.com Portal review complete reviewed -edit -photo",
        function(messages) {
            mailRejectionList = messages;
            psciRejectedCount.innerHTML = mailRejectionList.length;
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
            if (mailConfirmationList && mailAcceptanceList && mailRejectionList) {
                pendingMailCount = mailConfirmationList.length - mailAcceptanceList.length - mailRejectionList.length;
                psciPendingRow.hidden = false;
                psciPendingCount.innerHTML = pendingMailCount;
            }
        }
    };
    var request = getListRequest(query, null);
    request.execute(requestHandler);
}

function processConfirmationMails() {
    portalPendingList = [];
    processMails(
        mailConfirmationList, portalPendingList,
        function(length) {
            psciReceivedCount.innerHTML = length + "/" + mailConfirmationList.length;
        }
    );
}

function processAcceptanceMails() {
    portalAcceptedList = [];
    processMails(
        mailAcceptanceList, portalAcceptedList,
        function(length) {
            psciAcceptedCount.innerHTML = length + "/" + mailAcceptanceList.length;
        },
        getIntelAndLngLat
    );
}

function processRejectionMails() {
    portalRejectedList = [];
    processMails(
        mailRejectionList, portalRejectedList,
        function(length) {
            psciRejectedCount.innerHTML = length + "/" + mailRejectionList.length;
        },
        function(mailBody, portal) {
            getIntelAndLngLat(mailBody, portal);
            if (mailBody.search("too close to an existing Portal") > -1) {
                portal.rejectedFor = 1;
            } else if (mailBody.search("duplicate of either an existing Portal") > -1) {
                portal.rejectedFor = 2;
            } else {
                portal.rejectedFor = 0;
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
    if (mailConfirmationList == null || mailConfirmationList.length != portalPendingList.length ||
        mailAcceptanceList.length != portalAcceptedList.length ||
        mailRejectionList.length != portalRejectedList.length
    ) return;
    displayPortals();
}

function displayPortals() {
    // Remove the accepted and rejected portals from pending list
    for (var i = portalPendingList.length - 1; i >= 0; i--) {
        var shouldRemove = false;

        for (var j = 0; j < portalAcceptedList.length; j++) {
            if (portalAcceptedList[j].url === portalPendingList[i].url) {
                portalAcceptedList[j].confirmedTime = portalPendingList[i].time;
                shouldRemove = true;
                break;
            }
        }
        if (shouldRemove) {
            portalPendingList.splice(i, 1);
            continue;
        }

        for (var j = 0; j < portalRejectedList.length; j++) {
            if (portalRejectedList[j].url === portalPendingList[i].url) {
                portalRejectedList[j].confirmedTime = portalPendingList[i].time;
                shouldRemove = true;
                break;
            }
        }
        if (shouldRemove) {
            portalPendingList.splice(i, 1);
        } else {
            portalPendingList[i].confirmedTime = portalPendingList[i].time;
        }
    }

    var cardList = document.getElementById("cardList");
    var boundsNE = { lon: -181.0, lat: -91.0 };
    var boundsSW = { lon: 181.0, lat: 91.0 };

    for (var i = 0; i < portalAcceptedList.length; i++) {
        var portal = portalAcceptedList[i];
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

    for (var i = 0; i < portalPendingList.length; i++) {
        var portal = portalPendingList[i];
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

    for (var i = 0; i < portalRejectedList.length; i++) {
        var portal = portalRejectedList[i];
        var newCard = document.getElementById("templateCard").content.cloneNode(true);
        fillCardBasic(newCard, portal);
        var statusIconStack = newCard.getElementById("statusIconStack");
        switch (portal.rejectedFor) {
            case 1:
                statusIconStack.className = "fas fa-arrows-alt-h fa-stack-1x fa-inverse";
                statusIconStack.title = "Too close";
                break;
            case 2:
                statusIconStack.className = "fas fa-clone fa-stack-1x fa-inverse";
                statusIconStack.title = "Duplicated";
                break;
            default:
                statusIconStack.className = "fas fa-times fa-stack-1x fa-inverse";
                statusIconStack.title = "Undeclared";
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
    
    psciStatus.innerHTML = "Process finished.";

    psciAcceptedCount.innerHTML = portalAcceptedList.length + "/" + portalAcceptedList.length + "(" + (portalAcceptedList.length / mailConfirmationList.length * 100).toFixed(2) + "%)";
    psciRejectedCount.innerHTML = portalRejectedList.length + "/" + portalRejectedList.length + "(" + (portalRejectedList.length / mailConfirmationList.length * 100).toFixed(2) + "%)";
    psciPendingCount.innerHTML = portalPendingList.length + "/" + portalPendingList.length + "(" + (portalPendingList.length / mailConfirmationList.length * 100).toFixed(2) + "%)";

    psciCheckShowAccepted.disabled = false;
    psciCheckShowRejected.disabled = false;
    psciCheckShowPending.disabled = false;
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

function easeToMarker(lngLat) {
    map.easeTo({ center: lngLat, zoom: 16 });
}

function scrollToCard(portal) {
    var cardList = document.getElementById("cardList");
    cardList.scrollTo(0, portal.cardItem.offsetTop - cardList.offsetTop - 8);
}

function onChangeShowAccepted() {
    changeShow(portalAcceptedList, psciCheckShowAccepted.checked);
}

function onChangeShowRejected() {
    changeShow(portalRejectedList, psciCheckShowRejected.checked);
}

function onChangeShowPending() {
    changeShow(portalPendingList, psciCheckShowPending.checked);
}

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

/* END: Display Portals */
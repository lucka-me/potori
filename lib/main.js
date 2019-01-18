var authButton = document.getElementById("buttonAuth");
var signoutButton = document.getElementById("buttonSignout");

var psciStatus = document.getElementById("psciStatus");
var psciReceivedBox = document.getElementById("psciReceivedBox");
var psciAcceptedBox = document.getElementById("psciAcceptedBox");
var psciRejectedBox = document.getElementById("psciRejectedBox");
var psciPendingBox = document.getElementById("psciPendingBox");
var psciReceivedCount = document.getElementById("psciReceivedCount");
var psciAcceptedCount = document.getElementById("psciAcceptedCount");
var psciRejectedCount = document.getElementById("psciRejectedCount");
var psciPendingCount = document.getElementById("psciPendingCount");

var mailConfirmationList = null;
var mailAcceptanceList = null;
var mailRejectionList = null;

var cardList = document.getElementById("cardList");
var portalPendingList = [];
var portalAcceptedList = [];
var portalRejectedList = [];

var imagePath = "https://lh3.googleusercontent.com/";
var bsWatermeterPath = "http://kitten-114.getforge.io/watermeter.html#";

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
        psciReceivedBox.hidden = true;
        psciAcceptedBox.hidden = true;
        psciRejectedBox.hidden = true;
        psciPendingBox.hidden = true;
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
    psciReceivedBox.hidden = false;
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
    psciAcceptedBox.hidden = false;
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
    psciRejectedBox.hidden = false;
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
                psciPendingBox.hidden = false;
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
        function(mailBody, portal) {
            var intelTemp = mailBody.slice(mailBody.search("https://www.ingress.com/intel"));
            portal.intel = intelTemp.slice(0, intelTemp.search("\">"));
        }
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
            if (portalList.length == mailList.length) {
                tryToShowCards();
            }
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
            if (additionalProcessForMailBody) {
                additionalProcessForMailBody(mailBody, portal);
            }
            break;
        }
    }
    return portal;
}

function tryToShowCards() {
    if (mailConfirmationList.length != portalPendingList.length ||
        mailAcceptanceList.length != portalAcceptedList.length ||
        mailRejectionList.length != portalRejectedList.length
    ) {
        return;
    }
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
        }
    }

    for (var i = 0; i < portalAcceptedList.length; i++) {
        var portal = portalAcceptedList[i];
        var newCard = document.getElementById("templateCard").content.cloneNode(true);
        newCard.getElementById("statusIcon").className = "fas fa-check-circle fa-lg fa-fw fa-2x status-accepted";
        newCard.getElementById("portalTitle").hidden = true;
        newCard.getElementById("portalTitleLink").innerHTML = portal.name;
        newCard.getElementById("portalTitleLink").href = portal.intel;
        newCard.getElementById("portalTitleLink").hidden = false;
        newCard.getElementById("bsLink").href = getBsWatermeterUrl(portal.url);
        newCard.getElementById("portalImg").src = imagePath + portal.url;
        newCard.getElementById("portalConfirmedTime").innerHTML = getDateString(portal.confirmedTime);
        newCard.getElementById("portalInterval").innerHTML = Math.floor((portal.time - portal.confirmedTime) / (24 * 3600 * 1000)) + " days"
        newCard.getElementById("portalFinalIcon").className = "fas fa-check fa-fw";
        newCard.getElementById("portalFinalTime").innerHTML = getDateString(portal.time);
        document.getElementById("cardList").appendChild(newCard);
    }

    for (var i = 0; i < portalPendingList.length; i++) {
        var portal = portalPendingList[i];
        var newCard = document.getElementById("templateCard").content.cloneNode(true);
        newCard.getElementById("statusIcon").className = "fas fa-clock fa-lg fa-fw fa-2x status-pending";
        newCard.getElementById("portalTitle").innerHTML = portal.name;
        newCard.getElementById("bsLink").href = getBsWatermeterUrl(portal.url);
        newCard.getElementById("portalImg").src = imagePath + portal.url;
        newCard.getElementById("portalConfirmedTime").innerHTML = getDateString(portal.time);
        newCard.getElementById("portalInterval").innerHTML = Math.floor((new Date().getTime() - portal.time) / (24 * 3600 * 1000)) + " days"
        newCard.getElementById("portalFinalBox").hidden = true;
        document.getElementById("cardList").appendChild(newCard);
    }

    for (var i = 0; i < portalRejectedList.length; i++) {
        var portal = portalRejectedList[i];
        var newCard = document.getElementById("templateCard").content.cloneNode(true);
        if (portal.rejectedFor > 0) {
            newCard.getElementById("statusIconDiv").hidden = true;
            newCard.getElementById("statusIconStackDiv").hidden = false;
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

            }
        } else {
            newCard.getElementById("statusIcon").className = "fas fa-times-circle fa-lg fa-fw fa-2x status-rejected";
            newCard.getElementById("statusIcon").title = "Undeclared"
        }
        newCard.getElementById("portalTitle").innerHTML = portal.name;
        newCard.getElementById("bsLink").href = getBsWatermeterUrl(portal.url);
        newCard.getElementById("portalImg").src = imagePath + portal.url;
        newCard.getElementById("portalConfirmedTime").innerHTML = getDateString(portal.confirmedTime);
        newCard.getElementById("portalInterval").innerHTML = Math.floor((portal.time - portal.confirmedTime) / (24 * 3600 * 1000)) + " days"
        newCard.getElementById("portalFinalIcon").className = "fas fa-times fa-fw";
        newCard.getElementById("portalFinalTime").innerHTML = getDateString(portal.time);
        document.getElementById("cardList").appendChild(newCard);
    }

    psciStatus.innerHTML = "Process finished.";

    psciAcceptedCount.innerHTML = portalAcceptedList.length + "/" + portalAcceptedList.length + "(" + (portalAcceptedList.length / mailConfirmationList.length * 100).toFixed(2) + "%)";
    psciRejectedCount.innerHTML = portalRejectedList.length + "/" + portalRejectedList.length + "(" + (portalRejectedList.length / mailConfirmationList.length * 100).toFixed(2) + "%)";
    psciPendingCount.innerHTML = portalPendingList.length + "/" + portalPendingList.length + "(" + (portalPendingList.length / mailConfirmationList.length * 100).toFixed(2) + "%)";

}

function getDateString(time) {
    var date = new Date();
    date.setTime(time);
    return date.toLocaleDateString();
}

function getBsWatermeterUrl(imgUrl){
    return bsWatermeterPath + imgUrl.replace(/[^a-zA-Z0-9]/g, "").slice(- 10).toLowerCase();
}

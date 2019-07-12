const ui = {
    button: {
        openFile: document.getElementById("buttonOpenFile"),
        saveFile: document.getElementById("buttonSaveFile"),
        uploadFile: document.getElementById("buttonUploadFile"),
        auth: document.getElementById("buttonAuth"),
        signout: document.getElementById("buttonSignout"),
    },
    control: {
        status: document.getElementById("controlStatus"),
        collapseAll: document.getElementById("controlCollapseAll"),
        received: {
            row: document.getElementById("controlReceivedRow"),
            progress: {
                cell: document.getElementById("controlRecievedProgressCell"),
                redacted: document.getElementById("controlRecievedProgressRedacted"),
                prime: document.getElementById("controlRecievedProgressPrime"),
            },
            count: document.getElementById("controlReceivedCount"),
        },
        portals: {
            accepted: {
                row: document.getElementById("controlAcceptedRow"),
                progress: {
                    cell: document.getElementById("controlAcceptedProgressCell"),
                    redacted: document.getElementById("controlAcceptedProgressRedacted"),
                    prime: document.getElementById("controlAcceptedProgressPrime"),
                },
                count: document.getElementById("controlAcceptedCount"),
                checkShow: document.getElementById("controlAcceptedCheckShow"),
            },
            rejected: {
                row: document.getElementById("controlRejectedRow"),
                progress: {
                    cell: document.getElementById("controlRejectedProgressCell"),
                    redacted: document.getElementById("controlRejectedProgressRedacted"),
                    prime: document.getElementById("controlRejectedProgressPrime"),
                },
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
            ui.map.mapCtrl.addControl(new mapboxgl.NavigationControl());
        },
        easeTo: function(lngLat) { ui.map.mapCtrl.easeTo({ center: lngLat, zoom: 16 }); },
    },
    cardList: document.getElementById("cardList"),
    refresh: function() {
        ui.control.received.row.hidden = true;
        ui.button.openFile.hidden = false;
        ui.button.saveFile.hidden = true;
        for (let key of Object.keys(ui.control.portals)) {
            ui.control.portals[key].row.hidden = true;
            ui.control.portals[key].checkShow.disabled = true;
        }
        ui.cardList.innerHTML = "";
        for (let i = 0; i < portalList.length; i++) {
            if (portalList[i].marker) portalList[i].marker.remove()
        }
    },
    event: {
        changeShow: function(portals, show) {
            if (show) {
                for (let portal of portals) {
                    if (portal.marker) portal.marker.addTo(ui.map.mapCtrl);
                    document.getElementById("card-" + portal.id).parentNode.style.display = "flex";
                }
            } else {
                for (let portal of portals) {
                    if (portal.marker) portal.marker.remove();
                    document.getElementById("card-" + portal.id).parentNode.style.display = "none";
                }
            }
        },
        collapse: {
            all: function() {
                let isHidden = ui.control.portals.pending.row.hidden;
                for (let key of Object.keys(ui.control.portals)) {
                    ui.control.portals[key].row.hidden = !isHidden;
                }
                ui.event.collapse.reverseAngle(ui.control.collapseAll, isHidden);
            },
            rejectedReason: function() {
                let isHidden = true;
                for (let key of Object.keys(ui.control.portals.rejectedReason.reasons)) {
                    if (!ui.control.portals.rejectedReason.reasons[key].row.hidden) {
                        isHidden = false;
                        break;
                    }
                }
                for (let key of Object.keys(ui.control.portals.rejectedReason.reasons)) {
                    ui.control.portals.rejectedReason.reasons[key].row.hidden = !isHidden;
                }
                ui.event.collapse.reverseAngle(ui.control.portals.rejectedReason.collapse, isHidden);
            },
            reverseAngle: function(element, wasHidden) {
                element.className = wasHidden ? value.string.css.collapse.up : value.string.css.collapse.down;
            },
        },
        scrollToCard: function(id) {
            ui.cardList.scrollTo(0, document.getElementById("card-" + id).parentNode.offsetTop - ui.cardList.offsetTop - 8);
        },
    },
};

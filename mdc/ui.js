
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
        load: function() {
            mapboxgl.accessToken = value.string.mapbox.accessToken;
            ui.map.mapCtrl = new mapboxgl.Map({ container: "map", style: value.string.mapbox.style });
            this.mapCtrl.addControl(new mapboxgl.NavigationControl());
        },
        easeTo: function(lngLat) { this.mapCtrl.easeTo({ center: lngLat, zoom: 16 }); },
    },
    cardList: document.getElementById("cardList"),
    init: function() {
        this.button.openFile.root_.hidden = false;
        this.button.saveFile.root_.hidden = true;
        for (let key of Object.keys(this.status.block)) this.status.block[key].hidden = true;
        this.cardList.innerHTML = "";
        for (let portal of process.portalList) if (portal.marker) portal.marker.remove();
        this.progressBar.root_.hidden = true;
        this.progressBar.buffer = 0;
        this.progressBar.progress = 0;
    },
    event: {
        init: function() {
            for (let key of Object.keys(ui.button)) {
                ui.button[key].unbounded = true;
                ui.button[key].listen("click", this.button[key]);
            }
        },
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
};
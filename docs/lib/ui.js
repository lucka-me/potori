const ui = {
    dark: {
        enabled : false,
        onMediaQueryChanged: (mediaQueryList) => {
            ui.dark.enabled = mediaQueryList.matches;
            const style = mediaQueryList.matches ? value.string.mapbox.style.dark : value.string.mapbox.style.default;
            if (ui.mainMap.ctrl) ui.mainMap.ctrl.setStyle(style);
            if (ui.dialog.details.map.ctrl) ui.dialog.details.map.ctrl.setStyle(style);
        },
    },
    appBar: {
        status:     null,
        openFile:   null, saveFile: null, uploadFile: null,
        auth:       null, signout:  null,
        init: () => {
            const appBarActionDiv = document.querySelector(".mdc-top-app-bar__section--align-end");
            for (const key of Object.keys(ui.appBar)) {
                const buttonElement = document.createElement("button");
                buttonElement.className = "mdc-icon-button material-icons mdc-top-app-bar__action-item--unbounded";
                buttonElement.title = value.string.title.appBarButton[key];
                buttonElement.innerHTML = value.string.html.icon.appBar[key];
                appBarActionDiv.appendChild(buttonElement);
                ui.appBar[key] = new mdc.ripple.MDCRipple(buttonElement);
                ui.appBar[key].unbounded = true;
                ui.appBar[key].listen("click", ui.event.button[key]);
                buttonElement.hidden = true;
            }
            ui.appBar.status.root_.hidden = false;
        },
    },
    dialog: {
        status: {
            ctrl: new mdc.dialog.MDCDialog(document.querySelector("#dialog-status")),
            block: {
                type:           document.getElementById("block-dialog-status-type"),
                rejectedReason: document.getElementById("block-dialog-status-rejectedReason"),
            },
            filter: {
                type: {
                    accepted: { switch: null, label: null, portals: [], },
                    rejected: { switch: null, label: null, portals: [], },
                    pending:  { switch: null, label: null, portals: [], },
                },
                rejectedReason: {
                    undeclared: { switch: null, label: null, portals: [], },
                    duplicated: { switch: null, label: null, portals: [], },
                    tooClose:   { switch: null, label: null, portals: [], },
                },
            },
            init: () => {
                for (const block of Object.keys(ui.dialog.status.filter)) {
                    for (const key of (Object.keys(ui.dialog.status.filter[block]))) {
                        const switchId = `switch-filter-${block}-${key}`;
                        const switchBox = document.getElementById("template-switchBox").content.cloneNode(true);
                        const switchElement = switchBox.querySelector(".mdc-switch");
                        switchElement.id = switchId;
                        const switchLabel = switchBox.querySelector("label");
                        switchLabel.for = switchId;
                        const labelIcon = switchLabel.querySelector("i");
                        labelIcon.className += value.string.html.css[block === "type" ? key : "rejected"];
                        labelIcon.title = value.string.title.status[key];
                        labelIcon.innerHTML = value.string.html.icon[key];
                        ui.dialog.status.block[block].appendChild(switchBox);

                        const filter = ui.dialog.status.filter[block][key];
                        filter.switch = new mdc.switchControl.MDCSwitch(switchElement);
                        filter.label  = switchLabel.querySelector("span");
                        if (block === "type" && key === "rejected") {
                            filter.switch.listen("change", (_) => {
                                for (const key of Object.keys(ui.dialog.status.filter.rejectedReason)) {
                                    ui.dialog.status.filter.rejectedReason[key].switch.checked = ui.dialog.status.filter.type.rejected.switch.checked;
                                }
                                ui.event.changeShow(filter);
                            });
                        } else {
                            filter.switch.listen("change", (_) => ui.event.changeShow(filter));
                        }
                    }
                    ui.dialog.status.block[block].hidden = true;
                }
            },
        },
        details: {
            ctrl: new mdc.dialog.MDCDialog(document.querySelector("#dialog-details")),
            map: {
                ctrl: null, marker: null,
                edit: null, search: null, delete: null,
                onEdit: () => {
                    const map = ui.dialog.details.map;
                    if (!map.marker) {
                        map.marker = new mapboxgl.Marker()
                            .setLngLat(map.ctrl.getCenter())
                            .setDraggable(true)
                            .addTo(map.ctrl);
                        map.delete.root_.disabled = false;
                        map.edit.root_.innerHTML = "edit";
                    } else {
                        map.marker.setDraggable(true);
                    }
                },
                onSearch: () => {
                    const map = ui.dialog.details.map;
                    const onSuccess = (lngLat) => {
                        if (!ui.dialog.details.ctrl.isOpen) return;
                        if (!map.marker) {
                            map.marker = new mapboxgl.Marker()
                                .setLngLat(lngLat)
                                .addTo(map.ctrl);
                        } else {
                            map.marker.setLngLat(lngLat);
                        }
                        map.marker.setDraggable(false);
                        map.ctrl.easeTo({ center: lngLat, zoom: 16 });
                        map.edit.root_.innerHTML = "edit";
                        map.search.root_.disabled = false;
                        map.delete.root_.disabled = false;
                    };
                    const onFailed = () => {
                        if (!ui.dialog.details.ctrl.isOpen) return;
                        ui.dialog.alert.show(value.string.alert.queryLngLatFailed);
                        map.search.root_.disabled = false;
                    }
                    ui.dialog.details.map.search.root_.disabled = true;
                    firebaseKit.queryLngLat(ui.dialog.details.data.portal.id, onSuccess, onFailed);
                },
                onDelete: () => {
                    const map = ui.dialog.details.map;
                    if (map.marker) map.marker.remove();
                    map.marker = null;
                    map.edit.root_.innerHTML = "add";
                    map.delete.root_.disabled = true;
                }
            },
            status: {
                accepted: null, rejected: null, pending: null,
            },
            selectedStatus: null,
            rejectedReasonSelect: null,
            resultDateTimeField: null,
            data: { portal: null, keys: null },
            init: () => {
                const dialogElement = ui.dialog.details.ctrl.root_;
                const map = ui.dialog.details.map;
                map.ctrl = new mapboxgl.Map({
                    container: "map-dialog-details",
                    style: ui.dark.enabled ? value.string.mapbox.style.dark : value.string.mapbox.style.default
                });
                map.ctrl.addControl(new mapboxgl.NavigationControl());
    
                map.edit = new mdc.ripple.MDCRipple(dialogElement.querySelector("#button-dialog-details-map-edit"));
                map.edit.unbounded = true;
                map.edit.listen("click", map.onEdit);
                map.search = new mdc.ripple.MDCRipple(dialogElement.querySelector("#button-dialog-details-map-search"));
                map.search.unbounded = true;
                if (versionKit.fullFeature) {
                    map.search.listen("click", map.onSearch);
                } else {
                    dialogElement.querySelector("#button-dialog-details-map-search").hidden = true;
                }
                map.delete = new mdc.ripple.MDCRipple(dialogElement.querySelector("#button-dialog-details-map-delete"));
                map.delete.unbounded = true;
                map.delete.listen("click", map.onDelete);
    
                ui.dialog.details.resultDateTimeField = new mdc.textField.MDCTextField(dialogElement.querySelector("#field-dialog-details-result-datetime"));
                ui.dialog.details.rejectedReasonSelect = new mdc.select.MDCSelect(dialogElement.querySelector("#select-dialog-details-rejectedReason"));

                const onStatusRadioChange = (event) => {
                    ui.dialog.details.selectedStatus = event.target.value;
                    ui.dialog.details.resultDateTimeField.root_.hidden  =  (event.target.value === "pending" );
                    ui.dialog.details.resultDateTimeField.layout();
                    ui.dialog.details.rejectedReasonSelect.root_.hidden = !(event.target.value === "rejected");
                    ui.dialog.details.rejectedReasonSelect.layout();
                    map.ctrl.resize();
                };

                const statusRadiosBlock = dialogElement.querySelector("#block-dialog-details-status-radios");
                for (let key of Object.keys(ui.dialog.details.status)) {
                    const radioId = `radio-dialog-details-status-${key}`;
                    const radioField = document.getElementById("template-radioField").content.cloneNode(true);
                    const radioFieldElement = radioField.querySelector(".mdc-form-field");
                    const radioInput = radioFieldElement.querySelector("input");
                    const radioLabel = radioFieldElement.querySelector("label");
                    radioInput.name = "radio-dialog-details-status";
                    radioInput.id = radioId;
                    radioInput.value = key;
                    radioInput.addEventListener("change", onStatusRadioChange);
                    radioLabel.for = radioId;
                    radioLabel.className = `material-icons status-${key}`;
                    radioLabel.innerHTML = value.string.html.icon[key];
                    statusRadiosBlock.appendChild(radioFieldElement);

                    ui.dialog.details.status[key] = new mdc.radio.MDCRadio(radioFieldElement.querySelector(".mdc-radio"));
                    const formField = new mdc.formField.MDCFormField(radioFieldElement);
                    formField.input = ui.dialog.details.status[key];
                }
            },
            onOpened: () => {
                const portal = ui.dialog.details.data.portal;
                const keys = ui.dialog.details.data.keys;
                const map = ui.dialog.details.map;
                if (!map.ctrl) ui.dialog.details.init();
                map.ctrl.resize();
                if (map.marker) map.marker.remove();
                map.marker = null;
                if (portal.lngLat) {
                    map.marker = new mapboxgl.Marker()
                        .setLngLat(portal.lngLat)
                        .addTo(map.ctrl);
                    map.ctrl.jumpTo({ center: portal.lngLat, zoom: 16 });
                    map.delete.root_.disabled = false;
                    map.edit.root_.innerHTML = "edit";
                } else {
                    map.delete.root_.disabled = true;
                    map.edit.root_.innerHTML = "add";
                }
                ui.dialog.details.map.search.root_.disabled = false;

                ui.dialog.details.status[keys.type].checked = true;
                ui.dialog.details.selectedStatus = keys.type;

                const dateTime = toolkit.getLocalDateTimeISOString(portal.resultTime ? portal.resultTime : Date.now());
                ui.dialog.details.resultDateTimeField.value = dateTime.slice(0, dateTime.lastIndexOf(":"));
                ui.dialog.details.resultDateTimeField.layout();

                if (keys.type === value.string.key.status.rejected) {
                    ui.dialog.details.rejectedReasonSelect.selectedIndex = portal.status - value.code.status.undeclared;
                }
                ui.dialog.details.rejectedReasonSelect.layout();
            },
            onClosed: (event) => {
                const portal = ui.dialog.details.data.portal;
                const keys = ui.dialog.details.data.keys;
                const selectedStatus = ui.dialog.details.selectedStatus;
                if (event.detail.action === "save") {
                    let shouldRefresh = false;
                    if (selectedStatus !== value.string.key.status.pending) {
                        const time = Date.parse(ui.dialog.details.resultDateTimeField.value);
                        if (!time) {
                            ui.dialog.alert.show(value.string.alert.invalidDateTime);
                            return;
                        }
                        const newTime = time + toolkit.getLocalTimezoneOffset();
                        if (!portal.resultTime || (Math.floor(portal.resultTime / 60000) !== Math.floor(newTime / 60000))) {
                            portal.resultTime = newTime;
                            shouldRefresh = true;
                        }
                    }
                    const filters = ui.dialog.status.filter;
                    const rejectedReason = ui.dialog.details.rejectedReasonSelect.value;
                    const removeOldReason = () => {
                        for (let i = 0; i < filters.rejectedReason[keys.rejectedReason].portals.length; i++) {
                            if (filters.rejectedReason[keys.rejectedReason].portals[i].id === portal.id) {
                                filters.rejectedReason[keys.rejectedReason].portals.splice(i, 1);
                                break;
                            }
                        }
                        filters.rejectedReason[keys.rejectedReason].label.innerHTML = toolkit.getCountString(filters.rejectedReason[keys.rejectedReason].portals, filters.type.rejected.portals);
                    };
                    const addNewReason = () => {
                        filters.rejectedReason[rejectedReason].portals.push(portal);
                        filters.rejectedReason[rejectedReason].label.innerHTML = toolkit.getCountString(filters.rejectedReason[rejectedReason].portals, filters.type.rejected.portals);
                    };
                    if (selectedStatus !== keys.type) {
                        for (let i = 0; i < filters.type[keys.type].portals.length; i++) {
                            if (filters.type[keys.type].portals[i].id === portal.id) {
                                filters.type[keys.type].portals.splice(i, 1);
                                break;
                            }
                        }
                        filters.type[selectedStatus].portals.push(portal);
                        filters.type[keys.type].label.innerHTML = toolkit.getCountString(filters.type[keys.type].portals, process.portalList);
                        filters.type[selectedStatus].label.innerHTML = toolkit.getCountString(filters.type[selectedStatus].portals, process.portalList);

                        if (keys.rejectedReason) {
                            removeOldReason();
                        } else if (selectedStatus === value.string.key.status.rejected) {
                            addNewReason();
                        }
                        shouldRefresh = true;
                    } else if ((keys.type === value.string.key.status.rejected) && (keys.rejectedReason !== rejectedReason)) {
                        removeOldReason();
                        addNewReason();
                        shouldRefresh = true;
                    }
                    if (ui.dialog.details.map.marker) {
                        const lngLat = ui.dialog.details.map.marker.getLngLat();
                        if (!portal.lngLat || (portal.lngLat.lng !== lngLat.lng || portal.lngLat.lat !== lngLat.lat)) {
                            portal.lngLat = lngLat;
                            shouldRefresh = true;
                        }
                    } else if (portal.lngLat) {
                        portal.lngLat = null;
                        shouldRefresh = true;
                    }
                    if (shouldRefresh) {
                        portal.status = value.code.status[(ui.dialog.details.selectedStatus !== value.string.key.status.rejected) ? ui.dialog.details.selectedStatus : ui.dialog.details.rejectedReasonSelect.value];
                        const card = document.getElementById(`card-${portal.id}`);
                        ui.fillCard(portal, card);
                        ui.fillLocation(portal, card);
                    }
                }
            },
            show: (portal) => {
                ui.dialog.details.data.portal = portal;
                const keys = toolkit.parseStatusCodeToKeys(portal.status);
                ui.dialog.details.data.keys = keys;

                ui.dialog.details.ctrl.root_.querySelector(".mdc-dialog__title").innerHTML = portal.title;
                ui.dialog.details.ctrl.root_.querySelector("img").src = value.string.path.image + portal.image;
                ui.dialog.details.ctrl.root_.querySelector("#text-dialog-details-confirmedTime").innerHTML = toolkit.getDateTimeString(portal.confirmedTime);
                if (ui.dialog.details.map.ctrl) {
                    ui.dialog.details.resultDateTimeField.root_.hidden = (portal.status === value.code.status.pending);
                    ui.dialog.details.rejectedReasonSelect.root_.hidden = !(keys.type === value.string.key.status.rejected);
                } else {
                    ui.dialog.details.ctrl.root_.querySelector("#field-dialog-details-result-datetime").hidden = (portal.status === value.code.status.pending);
                    ui.dialog.details.ctrl.root_.querySelector("#select-dialog-details-rejectedReason").hidden = !(keys.type === value.string.key.status.rejected);
                }
                ui.dialog.details.ctrl.open();
            }
        },
        alert:  {
            ctrl: new mdc.dialog.MDCDialog(document.querySelector("#dialog-alert")),
            show: (message) => {
                ui.dialog.alert.ctrl.open();
                ui.dialog.alert.ctrl.root_.querySelector("#dialogAlertMessageBox").innerHTML = message;
            },
        },
    },
    progressBar: new mdc.linearProgress.MDCLinearProgress(document.querySelector("#progressBar")),
    mainMap: {
        ctrl: null,
        load: () => {
            mapboxgl.accessToken = value.string.mapbox.accessToken;
            ui.mainMap.ctrl = new mapboxgl.Map({ 
                container: "map-main",
                style: ui.dark.enabled ? value.string.mapbox.style.dark : value.string.mapbox.style.default
            });
            ui.mainMap.ctrl.addControl(new mapboxgl.NavigationControl());
        },
    },
    cardList: document.getElementById("cardList"),
    event: {
        button: {
            status:     (_) => ui.dialog.status.ctrl.open(),
            openFile:   (_) => fileKit.local.openFile(),
            saveFile:   (_) => fileKit.local.saveFile(),
            uploadFile: (_) => fileKit.googleDrive.uploadFile(),
            auth:       (_) => { },
            signout:    (_) => { },
        },
        changeShow: (filter) => {
            const hidden = !filter.switch.checked;
            for (const portal of filter.portals) {
                if (portal.marker) portal.marker.getElement().hidden = hidden;
                document.getElementById(`card-${portal.id}`).hidden = hidden;
            }
        },
        scrollToCard: (id) => {
            ui.cardList.scrollTo(0, document.getElementById(`card-${id}`).offsetTop - ui.cardList.offsetTop - 8);
        },
    },
    init: () => {
        document.getElementById("dialogStatusVersion").innerHTML = `${value.string.version}-${versionKit.code}`;
        const darkMediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
        darkMediaQueryList.addListener(ui.dark.onMediaQueryChanged);
        ui.dark.onMediaQueryChanged(darkMediaQueryList);

        ui.appBar.init();
        ui.dialog.status.init();

        ui.dialog.details.ctrl.listen("MDCDialog:opened", ui.dialog.details.onOpened);
        ui.dialog.details.ctrl.listen("MDCDialog:closed", ui.dialog.details.onClosed);
    },
    refresh: () => {
        ui.appBar.openFile.root_.hidden = false;
        ui.appBar.saveFile.root_.hidden = true;
        for (let key of Object.keys(ui.dialog.status.block)) ui.dialog.status.block[key].hidden = true;
        ui.cardList.innerHTML = "";
        for (let portal of process.portalList) if (portal.marker) portal.marker.remove();
        ui.progressBar.root_.hidden = true;
        ui.progressBar.buffer = 0;
        ui.progressBar.progress = 0;
    },
    getIconElement: (portal) => {
        const iconDiv = document.createElement("div");
        iconDiv.className = "map-marker";
        const icon = document.createElement("span");
        icon.className = "material-icons md-18";
        const keys = toolkit.parseStatusCodeToKeys(portal.status);
        iconDiv.className += `${value.string.html.css[keys.type]}--bg`;
        icon.innerHTML = value.string.html.icon[keys.rejectedReason ? keys.rejectedReason : keys.type];
        iconDiv.appendChild(icon);
        return iconDiv;
    },
    fillLocation: (portal, card) => {
        if (portal.marker) portal.marker.remove();
        portal.marker = null;
        if (portal.lngLat) {
            const icon = ui.getIconElement(portal);
            icon.onclick = () => ui.event.scrollToCard(portal.id);
            portal.marker = new mapboxgl.Marker({ element: icon })
                .setLngLat(portal.lngLat)
                .setPopup(new mapboxgl.Popup({ closeButton: false }).setText(portal.title))
                .addTo(ui.mainMap.ctrl);
        }

        const locationElement = card.querySelector("#button-card-location");
        if (portal.lngLat) {
            locationElement.hidden = false;
            const locationRipple = new mdc.ripple.MDCRipple(locationElement);
            locationRipple.unbounded = true;
            locationRipple.root_.onclick = () => {
                ui.mainMap.ctrl.easeTo({ center: portal.lngLat, zoom: 16 })
            };
        } else {
            locationElement.hidden = true;
        }

        if (versionKit.fullFeature) {
            const intelElement = card.querySelector("#button-card-intel");
            if (portal.lngLat) {
                intelElement.hidden = false;
                const intelRipple = new mdc.ripple.MDCRipple(intelElement);
                intelRipple.unbounded = true;
                intelRipple.root_.onclick = () => window.open(toolkit.lngLatToIntel(portal.lngLat), "_blank", "noopener");
            } else {
                intelElement.hidden = true;
            }
        }
    },
    fillCard: (portal, card) => {
        if (portal.status != value.code.status.pending) {
            card.querySelector("#cardInterval").innerHTML = toolkit.getIntervalString(portal.confirmedTime, portal.resultTime);
            card.querySelector("#cardResultBox").hidden = false;
            card.querySelector("#cardResultTime").innerHTML = toolkit.getDateString(portal.resultTime);
        } else {
            card.querySelector("#cardInterval").innerHTML = toolkit.getIntervalString(portal.confirmedTime, Date.now());
            card.querySelector("#cardResultBox").hidden = true;
        }

        const keys = toolkit.parseStatusCodeToKeys(portal.status);
        card.querySelector("#cardResultIcon").innerHTML = value.string.html.icon[keys.type];
        card.querySelector("#cardStatusButton").className = `mdc-button mdc-card__action mdc-card__action--button ${value.string.html.css[keys.type]}`;
        card.querySelector("#cardStatusButtonIcon").innerHTML = value.string.html.icon[keys.rejectedReason ? keys.rejectedReason : keys.type];
        card.querySelector("#cardStatusButtonLabel").innerHTML = value.string.title.status[keys.rejectedReason ? keys.rejectedReason : keys.type];
        return keys;
    },
    display: () => {
        const boundsNE = { lng: -181.0, lat: -91.0 };
        const boundsSW = { lng: 181.0, lat: 91.0 };

        const extendBounds = (lngLat) => {
            if (lngLat.lng > boundsNE.lng) boundsNE.lng = lngLat.lng;
            else if (lngLat.lng < boundsSW.lng) boundsSW.lng = lngLat.lng;
            if (lngLat.lat > boundsNE.lat) boundsNE.lat = lngLat.lat;
            else if (lngLat.lat < boundsSW.lat) boundsSW.lat = lngLat.lat;
        };

        for (const block of Object.keys(ui.dialog.status.filter)) {
            for (const key of Object.keys(ui.dialog.status.filter[block])) {
                ui.dialog.status.filter[block][key].portals = [];
            }
        }
        const noLatLngList = [];

        // Create cards, extend bounds and classify
        for (const portal of process.portalList) {
            const card = document.getElementById("template-card").content.cloneNode(true);

            card.querySelector(".mdc-card").id = `card-${portal.id}`;

            const mainAction = new mdc.ripple.MDCRipple(card.querySelector(".mdc-card__primary-action"));
            mainAction.listen("click", () => ui.dialog.details.show(portal));

            card.querySelector("img").src = value.string.path.image + portal.image;
            card.querySelector("#cardTitle").innerHTML = portal.title;
            card.querySelector("#cardConfirmedTime").innerHTML = toolkit.getDateString(portal.confirmedTime);
            const keys = ui.fillCard(portal, card);
            ui.dialog.status.filter.type[keys.type].portals.push(portal);
            if (keys.rejectedReason) ui.dialog.status.filter.rejectedReason[keys.rejectedReason].portals.push(portal);

            const statusRipple = new mdc.ripple.MDCRipple(card.querySelector("#cardStatusButton"));
            statusRipple.unbounded = true;
            if (versionKit.fullFeature) {
                statusRipple.listen("click", () => window.open(value.string.path.bsWatermeter + portal.id, "_blank"));
            } else {
                statusRipple.listen("click", () => {
                    const textarea = document.createElement("textarea");
                    textarea.value = portal.id;
                    textarea.readOnly = true;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand("copy");
                    document.body.removeChild(textarea);
                    ui.dialog.alert.show(`Brainstorming ID copied: ${portal.id}`);
                });
            }
            if (portal.lngLat) {
                extendBounds(portal.lngLat);
                ui.fillLocation(portal, card);
            } else {
                noLatLngList.push(portal);
            }
            ui.cardList.appendChild(card);
        }

        if (boundsNE.lng > -180 && boundsNE.lat > -90 && boundsSW.lng < 180 && boundsSW.lat < 90) {
            ui.mainMap.ctrl.fitBounds([boundsSW, boundsNE], {
                padding: 16,
                linear: true
            });
        }

        for (const key of Object.keys(ui.dialog.status.filter.type)) {
            ui.dialog.status.filter.type[key].label.innerHTML = toolkit.getCountString(ui.dialog.status.filter.type[key].portals, process.portalList);
        }
        for (const key of Object.keys(ui.dialog.status.filter.rejectedReason)) {
            const filter = ui.dialog.status.filter.rejectedReason[key];
            ui.dialog.status.filter.rejectedReason[key].label.innerHTML = toolkit.getCountString(filter.portals, ui.dialog.status.filter.type.rejected.portals);
        }
        for (const key of Object.keys(ui.dialog.status.block)) ui.dialog.status.block[key].hidden = false;

        const onFinished = () => {
            ui.appBar.saveFile.root_.hidden = false;
            ui.appBar.uploadFile.root_.hidden = !gapi.auth2.getAuthInstance().isSignedIn.get();
            ui.progressBar.root_.hidden = true;
        };

        if (versionKit.fullFeature && (noLatLngList.length > 0)) {
            let count = 0;
            const countUp = () => {
                count += 1;
                if (count === noLatLngList.length) onFinished();
            };
            for (const portal of noLatLngList) {
                firebaseKit.queryLngLat(
                    portal.id,
                    (lngLat) => {
                        portal.lngLat = lngLat;
                        ui.fillLocation(portal, document.getElementById(`card-${portal.id}`));
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
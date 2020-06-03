const UiKitProtorype = {
    init(parent) {},
};

const ui = {
    dark: {
        enabled : false,
        init() {
            const darkMediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
            darkMediaQueryList.addListener((query) => ui.dark.mediaQueryChanged(query));
            this.mediaQueryChanged(darkMediaQueryList);
        },
        mediaQueryChanged(mediaQueryList) {
            ui.dark.enabled = mediaQueryList.matches;
            const style = value.string.mapbox.style[ui.dark.enabled ? 'dark' : 'default'];
            if (mapKit.isLoaded()) {
                mapKit.ctrl.setStyle(style);
                mapKit.ctrl.once('render', () => mapKit.updateData());
            }
            ui.dashboardKit.updateStyle();
            if (dialog.details.map.ctrl) dialog.details.map.ctrl.setStyle(style);
        },
    },
    appBar: UiKitProtorype,
    progressBar: new mdc.linearProgress.MDCLinearProgress(document.querySelector('#progress-bar')),
    dashboardKit: UiKitProtorype,
    list: UiKitProtorype,
    dialogKit: UiKitProtorype,
    init() {
        const body = document.body;
        this.dark.init();

        this.appBar.init(body);
        const mainBox = eliKit.build('div', {
            className: [
                'flex--1',
                'flex-box-row--wrap',
                'main-box'
            ].join(' '),
            styleText: [
                'min-height: 0%',
            ].join(';'),
        });
        body.appendChild(mainBox);
        this.dashboardKit.init(mainBox);
        this.list.init(mainBox);
        this.dialogKit.init(mainBox);
    },
    switchView() {
        const switchToList = ui.appBar.button.view.root_.innerHTML === 'view_list';
        ui.appBar.button.view.root_.innerHTML = switchToList ? 'dashboard' : 'view_list';
        ui.appBar.button.view.root_.title = switchToList ? 'Dashboard' : 'List';
        document.querySelector('#dashboard').classList.toggle('view-hide');
        this.dashboardKit.root.classList.toggle('view-hide');
        this.list.root.classList.toggle('view-hide');
    },
    clear() {
        ui.appBar.menu.item.openFile.hidden = false;
        ui.appBar.menu.item.saveFile.hidden = true;

        this.dashboardKit.setVisible(false);
        this.list.clear();
        if (mapKit.isLoaded()) mapKit.updateData();
        ui.progressBar.root_.hidden = true;
        ui.progressBar.buffer = 0;
        ui.progressBar.progress = 0;
    },
    show() {
        const boundsNE = { lng: -181.0, lat: -91.0 };
        const boundsSW = { lng:  181.0, lat:  91.0 };
        for (const portal of process.portals) {
            if (!portal.lngLat) continue;
            if (portal.lngLat.lng > boundsNE.lng) boundsNE.lng = portal.lngLat.lng;
            else if (portal.lngLat.lng < boundsSW.lng) boundsSW.lng = portal.lngLat.lng;
            if (portal.lngLat.lat > boundsNE.lat) boundsNE.lat = portal.lngLat.lat;
            else if (portal.lngLat.lat < boundsSW.lat) boundsSW.lat = portal.lngLat.lat;
        }
        this.list.show();
        this.dashboardKit.refresh();
        this.dashboardKit.setVisible(true);
        if (boundsSW.lng > -181) {
            mapKit.ctrl.fitBounds([boundsSW, boundsNE], { linear: true });
        }
        this.appBar.menu.item.saveFile.hidden = false;
        this.appBar.menu.item.uploadFile.hidden = !gapi.auth2.getAuthInstance().isSignedIn.get();
        this.appBar.menu.item.import.hidden = false;
        this.progressBar.root_.hidden = true;
    },
};
const ui = {
    dark: {
        enabled : false,
        onMediaQueryChanged: (mediaQueryList) => {
            ui.dark.enabled = mediaQueryList.matches;
            const style = value.string.mapbox.style[ui.dark.enabled ? 'dark' : 'default'];
            if (mapKit.isLoaded()) {
                mapKit.ctrl.setStyle(style);
                mapKit.ctrl.once('render', () => mapKit.updateData());
            }
            dashboard.updateStyle();
            if (dialog.details.map.ctrl) dialog.details.map.ctrl.setStyle(style);
        },
    },
    appBar: null,
    progressBar: new mdc.linearProgress.MDCLinearProgress(document.querySelector('#progress-bar')),
    list: null,
    init() {
        const darkMediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
        darkMediaQueryList.addListener(ui.dark.onMediaQueryChanged);
        ui.dark.onMediaQueryChanged(darkMediaQueryList);

        this.appBar.init();
        this.list.init(document.querySelector('.main-box'));
        dashboard.init();
        dialogCtrl.init();
    },
    switchView: () => {
        const switchToList = ui.appBar.button.view.root_.innerHTML === 'view_list';
        ui.appBar.button.view.root_.innerHTML = switchToList ? 'dashboard' : 'view_list';
        ui.appBar.button.view.root_.title = switchToList ? 'Dashboard' : 'List';
        document.querySelector('#dashboard').classList.toggle('view-hide');
        list.root.classList.toggle('view-hide');
    },
    clear() {
        ui.appBar.menu.item.openFile.hidden = false;
        ui.appBar.menu.item.saveFile.hidden = true;

        dashboard.setVisible(false);
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
        dashboard.refresh();
        dashboard.setVisible(true);
        if (boundsSW.lng > -181) {
            mapKit.ctrl.fitBounds([boundsSW, boundsNE], { linear: true });
        }
        this.appBar.menu.item.saveFile.hidden = false;
        this.appBar.menu.item.uploadFile.hidden = !gapi.auth2.getAuthInstance().isSignedIn.get();
        this.appBar.menu.item.import.hidden = false;
        this.progressBar.root_.hidden = true;
    },
};
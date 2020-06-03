const UiKitProtorype = {
    init(parent) { parent },
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
    progress: UiKitProtorype,
    dashboardKit: UiKitProtorype,
    list: UiKitProtorype,
    dialogKit: UiKitProtorype,
    init() {
        this.dark.init();

        const body = document.body;
        body.className = 'mdc-typography fullheight flex-box-col';
        this.appBar.init(body);
        this.progress.init(body);

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
        this.dialogKit.init(body);
    },
    switchView() {
        const switchToList = this.appBar.button.view.root_.innerHTML === 'view_list';
        this.appBar.button.view.root_.innerHTML = switchToList ? 'dashboard' : 'view_list';
        this.appBar.button.view.root_.title = switchToList ? 'Dashboard' : 'List';
        document.querySelector('#dashboard').classList.toggle('view-hide');
        this.dashboardKit.root.classList.toggle('view-hide');
        this.list.root.classList.toggle('view-hide');
    },
    clear() {
        this.appBar.menu.item.openFile.hidden = false;
        this.appBar.menu.item.saveFile.hidden = true;

        this.dashboardKit.setVisible(false);
        this.list.clear();
        if (mapKit.isLoaded()) mapKit.updateData();
        this.progress.ctrl.root_.hidden = true;
        this.progress.ctrl.buffer = 0;
        this.progress.ctrl.progress = 0;
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
        this.progress.ctrl.root_.hidden = true;
    },
};
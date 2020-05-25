const auth = {
    handleClientLoad: () => gapi.load('client:auth2', auth.initClient),
    initClient: () => {
        gapi.client.init(value.string.gapiOptions).then(
            () => {
                // Listen for sign-in state changes.
                gapi.auth2.getAuthInstance().isSignedIn.listen(auth.updateStatus);
                // Handle the initial sign-in state.
                auth.updateStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            },
            (error) => dialogKit.alert.shows(JSON.stringify(error, null, 2))
        );
    },
    updateStatus: (isSignedIn) => {
        if (isSignedIn) {
            ui.appBar.button.signin.root_.hidden = true;
            ui.appBar.menu.item.signout.hidden = false;
            mariKit.start();
        } else {
            ui.refresh();
            process.portals = [];
            ui.appBar.button.signin.root_.hidden = false;
            ui.appBar.menu.item.signout.hidden = true;
            ui.appBar.menu.item.uploadFile.hidden = true;
            ui.appBar.menu.item.import.hidden = true;
        }
    },
    signIn: () => gapi.auth2.getAuthInstance().signIn(),
    signOut: () => gapi.auth2.getAuthInstance().signOut(),
};
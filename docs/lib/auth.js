const auth = {
    handleClientLoad: () => gapi.load("client:auth2", auth.initClient),
    initClient: () => {
        gapi.client.init(value.string.gapiOptions).then(
            () => {
                // Listen for sign-in state changes.
                gapi.auth2.getAuthInstance().isSignedIn.listen(auth.updateStatus);
                // Handle the initial sign-in state.
                ui.appBar.auth.listen("click", (_) => gapi.auth2.getAuthInstance().signIn());
                ui.appBar.signout.listen("click", (_) => gapi.auth2.getAuthInstance().signOut());
                auth.updateStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            },
            (error) => ui.dialog.show.alert(JSON.stringify(error, null, 2))
        );
    },
    updateStatus: (isSignedIn) => {
        if (isSignedIn) {
            ui.appBar.auth.root_.hidden = true;
            ui.appBar.signout.root_.hidden = false;
            process.start();
        } else {
            ui.refresh();
            process.portalList = [];
            ui.appBar.auth.root_.hidden = false;
            ui.appBar.signout.root_.hidden = true;
            ui.appBar.uploadFile.root_.hidden = true;
        }
    },
};
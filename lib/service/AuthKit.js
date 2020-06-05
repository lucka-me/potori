class AuthKit {
    handleClientLoad() {
        gapi.load('client:auth2', () => this.initClient());
    }

    initClient() {
        gapi.client.init(value.string.gapiOptions).then(() => {
                // Listen for sign-in state changes.
                gapi.auth2.getAuthInstance().isSignedIn.listen((signedIn) => this.updateStatus(signedIn));
                // Handle the initial sign-in state.
                this.updateStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            },
            (error) => ui.dialog.alert.open(JSON.stringify(error, null, 2))
        );
    }

    updateStatus(signedIn) {
        if (signedIn) {
            ui.appBar.button.signin.root_.hidden = true;
            ui.appBar.menu.item.signout.hidden = false;
            service.startMail();
        } else {
            service.portals = [];
            ui.clear();
            ui.appBar.button.signin.root_.hidden = false;
            ui.appBar.menu.item.signout.hidden = true;
            ui.appBar.menu.item.uploadFile.hidden = true;
            ui.appBar.menu.item.import.hidden = true;
        }
    }

    signIn() {
        gapi.auth2.getAuthInstance().signIn();
    }

    signOut() {
        gapi.auth2.getAuthInstance().signOut();
    }
}

export { AuthKit };
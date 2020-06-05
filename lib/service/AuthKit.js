class AuthKit {
    constructor() {
        this.event = {
            authStatusChanged: (signedIn) => { signedIn },
            onerror: (error) => { error },
        };
    }

    handleClientLoad() {
        gapi.load('client:auth2', () => this.initClient());
    }

    initClient() {
        gapi.client.init(value.string.gapiOptions).then(() => {
                // Listen for sign-in state changes.
                gapi.auth2.getAuthInstance().isSignedIn.listen(this.event.authStatusChanged);
                // Handle the initial sign-in state.
                this.event.authStatusChanged(gapi.auth2.getAuthInstance().isSignedIn.get());
            },
            this.onerror
        );
    }

    signIn() {
        gapi.auth2.getAuthInstance().signIn();
    }

    signOut() {
        gapi.auth2.getAuthInstance().signOut();
    }
}

export default AuthKit;
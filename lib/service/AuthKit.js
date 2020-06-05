class AuthKit {
    constructor() {
        this.authStatusChanged = (signedIn) => { signedIn };
        this.onerror = (error) => { error };
    }

    handleClientLoad() {
        gapi.load('client:auth2', () => this.initClient());
    }

    initClient() {
        gapi.client.init(value.string.gapiOptions).then(() => {
                // Listen for sign-in state changes.
                gapi.auth2.getAuthInstance().isSignedIn.listen(this.authStatusChanged);
                // Handle the initial sign-in state.
                this.authStatusChanged(gapi.auth2.getAuthInstance().isSignedIn.get());
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

export { AuthKit };
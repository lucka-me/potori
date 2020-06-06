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
        gapi.client.init({
            apiKey: 'AIzaSyCqIaS8UizqjWrIKm5zV3_S8EffCWjKR-A',
            clientId: '361295761775-qshg0f5buh495dhubp4v5bignk7i5dh1.apps.googleusercontent.com',
            discoveryDocs: [
                'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
                'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
            ],
            scope: [
                'https://www.googleapis.com/auth/gmail.readonly',
                'https://www.googleapis.com/auth/drive.file',
                'https://www.googleapis.com/auth/drive.appdata'
            ].join(' '),
        }).then(
            () => {
                // Listen for sign-in state changes.
                gapi.auth2.getAuthInstance().isSignedIn.listen(this.event.authStatusChanged);
                // Handle the initial sign-in state.
                this.event.authStatusChanged(gapi.auth2.getAuthInstance().isSignedIn.get());
            },
            this.event.onerror
        );
    }

    signIn() { gapi.auth2.getAuthInstance().signIn(); }

    signOut() { gapi.auth2.getAuthInstance().signOut(); }
}

export default AuthKit;
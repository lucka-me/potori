type AuthStatusChangedCallback = (signedIn: boolean) => void;
type ErrorCallback = (message: string) => void;

/**
 * Events for {@link AuthKit}
 */
interface AuthKitEvents {
    authStatusChanged: AuthStatusChangedCallback;   // Triggered when sign-in or sign-out
    error: ErrorCallback;   // Triggered when gapi.auth error occures
}

/**
 * Handle GAPI authentication
 */
class AuthKit {

    events: AuthKitEvents = {
        authStatusChanged: () => { },
        error: () => { },
    };

    init() {
        if (navigator.onLine) {
            gapi.load('client:auth2', () => this.initClient());
        }
    }

    /**
     * Initialize the GAPI and load client libraries
     */
    private initClient() {
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
                gapi.auth2.getAuthInstance().isSignedIn.listen(this.events.authStatusChanged);
                // Handle the initial sign-in state.
                this.events.authStatusChanged(this.signedIn);
            },
            this.events.error
        );
    }

    /**
     * Get authentication status, signed in or not
     */
    get signedIn() {
        return gapi.auth2.getAuthInstance().isSignedIn.get();
    }

    /**
     * Get the token for accessing the account
     */
    get accessToken() {
        return gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
    }

    /**
     * Sign in
     */
    signIn() {
        gapi.auth2.getAuthInstance().signIn();
    }

    /**
     * Sign out
     */
    signOut() {
        gapi.auth2.getAuthInstance().signOut();
    }
}

export default new AuthKit();
import AuthKit from './auth';
import GoogleDriveKit from './drive';

type BasicCallback = () => void;

export default class GoogleKit {

    auth = new AuthKit();
    drive = new GoogleDriveKit();

    init(callback: BasicCallback) {
        const scriptTag = document.createElement('script');
        scriptTag.src = 'https://apis.google.com/js/api.js';
        scriptTag.defer = true;
        scriptTag.async = true;
        scriptTag.onload = callback;
        document.head.append(scriptTag);
    }
}
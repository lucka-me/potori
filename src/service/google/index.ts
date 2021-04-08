import { util } from '@/service/utils';
import AuthKit from './auth';
import GoogleDriveKit from './drive';

type BasicCallback = () => void;

export default class GoogleKit {

    auth = new AuthKit();
    drive = new GoogleDriveKit();

    init(callback: BasicCallback) {
        util.loadScript('https://apis.google.com/js/api.js')
            .then(() => {
                callback();
            });
    }
}
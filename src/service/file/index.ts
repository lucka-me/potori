import Constants from './constants';
import GoogleDriveFileKit from './google-drive';
import LocalFileKit from './local';

export default class FileKit {
    local       = new LocalFileKit();
    googleDrive = new GoogleDriveFileKit();
}

export { Constants };
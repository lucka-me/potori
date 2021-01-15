import GoogleDriveFileKit, { DownloadCallback } from './google-drive';
import LocalFileKit from './local';

export enum Filename {
    nominations = 'nominations.json',
    nominationsLegacy = 'potori.json',
    bsData = 'bsdata.json',
}

export default class FileKit {
    local       = new LocalFileKit();
    googleDrive = new GoogleDriveFileKit();
}

export { DownloadCallback };
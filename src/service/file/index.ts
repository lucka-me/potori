import Constants from "./constants";
import GoogleDriveFileKit from "./googleDrive";
import LocalFileKit from "./local";

export default class FileKit {
    local       = new LocalFileKit();
    googleDrive = new GoogleDriveFileKit();
}

export { Constants as FileConst };
import i18next from "i18next";

/**
 * Constants for {@link FileKit}
 */
export class FileConst {
    static type = 'application/json';
    static nominations = 'potori.json';
    static bsData = 'bsdata.json';
}

/**
 * Events for {@link @LocalFileKit}
 */
interface LocalFileKitEvents {
    /**
     * Triggered when require the UI to open a file
     * @param opened Callback that should be triggered when file is opened
     */
    openUI: (opened: (file: File) => void) => void;
    /**
     * Triggered when require the UI to save a file
     * @param filename The default filename to save
     * @param href URL of the content
     */
    saveUI: (filename: string, href: string) => void;
}

/**
 * Open and save local files
 */
class LocalFileKit {

    events: LocalFileKitEvents = {
        openUI: () => {},
        saveUI: () => {},
    }

    /**
     * Open a local file
     * @param onload Triggered when content is loaded
     * @param onerror Triggered when error occurs
     */
    open(onload: (result: string) => void, onerror: (message: string) => void) {
        this.events.openUI((file: File) => {
            if (!file) {
                onerror(i18next.t('message:Failed to open file'));
                return;
            }
            const fileReader = new FileReader();
            fileReader.onload = () => {
                onload(fileReader.result as string);
            };
            fileReader.readAsText(file);
        });
    }

    /**
     * Save a local file
     * @param filename Default filename
     * @param blob Content to save
     */
    save(filename: string, blob: Blob) {
        this.events.saveUI(filename, URL.createObjectURL(blob));
    }
}

/**
 * Download and upload from / to Google Drive
 */
class GoogleDriveFileKit {

    private ids: Map<string, string> = new Map();

    private static get folder() { return 'appDataFolder' }

    /**
     * Download file from Google Drive.
     * 
     * If there are multiple files (more === true), the caller should decide
     * whether to delete the current one & download next one or not by return a boolean
     * 
     * @param filename Name of the file to download
     * @param got Triggered when a file is downloaded
     */
    get(filename: string, got: (file: gapi.client.drive.File, more: boolean) => boolean) {
        const gotList = (fileList: Array<gapi.client.drive.File>) => {
            if (fileList.length < 1) {
                got(null, false);
                return;
            }
            const fileId = fileList[0].id;
            gapi.client.drive.files.get({
                fileId: fileId,
                alt: "media"
            }).then((response: gapi.client.Response<gapi.client.drive.File>) => {
                if (!got(response.result, true)) {
                    gapi.client.drive.files.delete({ fileId: fileId });
                    fileList.splice(0, 1);
                    gotList(fileList);
                    return;
                } else {
                    this.ids.set(filename, fileId);
                }
            });
        };

        gapi.client.drive.files.list({
            q: `name = '${filename}'`,
            pageSize: 10,
            spaces: GoogleDriveFileKit.folder,
            fields: 'files(id)'
        }).then((response: gapi.client.Response<gapi.client.drive.FileList>) => {
            const files = response.result.files;
            if (!files) {
                got(null, false);
                return;
            }
            gotList(files);
        });
    }

    /**
     * Upload file to Google Drive
     * @param filename Filename to upload
     * @param blob Content to upload
     * @param token The Google account access token
     * @param finished Triggered when process finished
     */
    upload(filename: string, blob: Blob, token: string, finished: (response: any) => void) {
        // Ref: https://gist.github.com/tanaikech/bd53b366aedef70e35a35f449c51eced
        let url = '';
        let method = '';
        const metadata: any = {
            name: filename,
            mimeType: FileConst.type,
        };
        // Using parent in Update will cause 403
        if (this.ids.has(filename)) {
            method = 'PATCH';
            url = `https://www.googleapis.com/upload/drive/v3/files/${this.ids.get(filename)}?uploadType=multipart`;
        } else {
            method = 'POST';
            url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
            metadata.parents = [ GoogleDriveFileKit.folder ];
        }
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: FileConst.type }));
        form.append('file', blob);
        const authHeader = `Bearer ${token}`;
        fetch(url, {
            method: method,
            headers: new Headers({ Authorization: authHeader }),
            body: form,
        })
            .then(response => response.json())
            .then(response => {
                if (response && response.id) {
                    this.ids.set(filename, response.id);
                }
                finished(response);
            })
            .catch(() => finished(null));
    }
}

export default class FileKit {
    local       = new LocalFileKit();
    googleDrive = new GoogleDriveFileKit();
}
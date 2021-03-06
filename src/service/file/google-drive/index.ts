export type DownloadCallback = (file?: gapi.client.drive.File) => boolean;
type UploadCallback = (succeed: boolean, message?: string) => void;

/**
 * Download and upload from / to Google Drive
 */
export default class GoogleDriveKit {

    private static readonly folder = 'appDataFolder';   // The private folder in Google Drive

    private ids: Map<string, string> = new Map();   // ID of files, <filename, id>

    /**
     * Download file from Google Drive.
     * 
     * The caller should decide whether to delete the current one & download
     * next one or not by return a boolean
     * 
     * @param filename Name of the file to download
     * @param callback Triggered when a file is downloaded
     */
    download(filename: string, callback: DownloadCallback) {
        const listHandler = (fileList: Array<gapi.client.drive.File>) => {
            if (fileList.length < 1) {
                callback();
                return;
            }
            const fileId = fileList[0].id!;
            gapi.client.drive.files.get({
                fileId: fileId,
                alt: 'media'
            }).then((response: gapi.client.Response<gapi.client.drive.File>) => {
                if (callback(response.result)) {
                    gapi.client.drive.files.delete({ fileId: fileId });
                    fileList.splice(0, 1);
                    listHandler(fileList);
                } else {
                    this.ids.set(filename, fileId);
                }
            });
        };

        gapi.client.drive.files.list({
            q: `name = '${filename}'`,
            pageSize: 10,
            spaces: GoogleDriveKit.folder,
            fields: 'files(id)'
        }).then((response: gapi.client.Response<gapi.client.drive.FileList>) => {
            const files = response.result.files;
            if (!files) {
                callback();
                return;
            }
            listHandler(files);
        });
    }

    /**
     * Upload file to Google Drive
     * @param filename Filename to upload
     * @param mimeType MIME type of the file
     * @param blob Content to upload
     * @param token The Google account access token
     * @param callback Triggered when process finished
     */
    upload(filename: string, mimeType: string, blob: Blob, token: string, callback: UploadCallback) {
        // Ref: https://gist.github.com/tanaikech/bd53b366aedef70e35a35f449c51eced
        let url = '';
        let method = '';
        const metadata: any = {
            name: filename,
            mimeType: mimeType,
        };
        // Using parent in Update will cause 403
        if (this.ids.has(filename)) {
            method = 'PATCH';
            url = `https://www.googleapis.com/upload/drive/v3/files/${this.ids.get(filename)}?uploadType=multipart`;
        } else {
            method = 'POST';
            url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
            metadata.parents = [ GoogleDriveKit.folder ];
        }
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: mimeType }));
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
                    callback(true);
                } else {
                    callback(false, response.message);
                }
            })
            .catch(() => callback(false));
    }
}
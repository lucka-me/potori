type FileValidator = (file: gapi.client.drive.File) => boolean;

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
    async download(filename: string, validator: FileValidator) {
        const listResponse = await gapi.client.drive.files.list({
            q: `name = '${filename}'`,
            pageSize: 10,
            spaces: GoogleDriveKit.folder,
            fields: 'files(id)'
        });
        if (!listResponse.result.files) return undefined;
        const list = listResponse.result.files;
        for (const file of list) {
            if (!file.id) continue;
            const fileResponse = await gapi.client.drive.files.get({
                fileId: file.id,
                alt: 'media'
            });
            const solidFile = fileResponse.result;
            if (validator(solidFile)) {
                this.ids.set(filename, file.id);
                return solidFile;
            }
            gapi.client.drive.files.delete({ fileId: file.id })
        }
    }

    /**
     * Upload file to Google Drive
     * @param filename Filename to upload
     * @param mimeType MIME type of the file
     * @param blob Content to upload
     * @param token The Google account access token
     * @param callback Triggered when process finished
     */
    async upload(filename: string, mimeType: string, blob: Blob, token: string) {
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
        let response: any | undefined;
        try {
            const responseRaw = await fetch(url, {
                method: method,
                headers: new Headers({ Authorization: authHeader }),
                body: form,
            });
            response = await responseRaw.json();
        } catch {
            return false;
        }
        if (!response || typeof response.id !== 'string') return false;
        this.ids.set(filename, response.id);
        return true;
    }
}
import i18next from "i18next";

class FileConst {
    static type = 'application/json';
    static nominations = 'potori.json';
    static bsData = 'bsdata.json';
}

interface LocalFileKitEvents {
    openUI: (opened: (event: Event) => void) => void;
    saveUI: (filename: string, href: string) => void;
}

class LocalFileKit {

    events: LocalFileKitEvents = {
        openUI: () => {},
        saveUI: () => {},
    }

    open(onload: (result: string) => void, onerror: (message: string) => void) {
        this.events.openUI((event: Event) => {
            const file = (event.target as HTMLInputElement).files[0];
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

    save(filename: string, blob: Blob) {
        this.events.saveUI(filename, URL.createObjectURL(blob));
    }
}

class GoogleDriveFileKit {

    ids: Map<string, string> = new Map();

    static get folder() { return 'appDataFolder' }

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

class FileKit {
    local       = new LocalFileKit();
    googleDrive = new GoogleDriveFileKit();
}

export default FileKit;
export { FileConst };
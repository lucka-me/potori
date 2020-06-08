import Eli from "../ui/Eli.js";

class FileConst {
    static get type() { return 'application/json' }
    static get portals() { return 'potori.json' }
    static get bsData() { return 'bsdata.json' }
}

class LocalFileKit {
    constructor() {}

    open(onload, onerror) {
        const element = Eli.build('input', {
            styleText: 'display:none;',
            type: 'file', accept: 'json'
        });
        const opened = (event) => {
            const file = event.target.files[0];
            if (!file) {
                onerror('Failed to open file.');
                return;
            }
            const fileReader = new FileReader();
            fileReader.onload = () => onload(fileReader.result);
            fileReader.readAsText(file);
        };
        element.addEventListener('change', opened, false);
        document.body.appendChild(element);
        element.click();
        setTimeout(() => {
            document.body.removeChild(element);
        }, 1000);
    }

    save(filename, blob) {
        const element = Eli.build('a', {
            styleText: 'display:none',
            href: URL.createObjectURL(blob),
            download: filename,
        });
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}

class GoogleDriveFileKit {
    constructor() {
        this.idMap = new Map();
    }

    static get folder() { return 'appDataFolder' }

    get(filename, onGet) {
        const onGetFileList = (fileList) => {
            if (fileList.length < 1) {
                onGet(null, false);
                return;
            }
            const fileId = fileList[0].id;
            gapi.client.drive.files.get({
                fileId: fileId,
                alt: "media"
            }).then((response) => {
                if (!onGet(response.result, true)) {
                    gapi.client.drive.files.delete({ fileId: fileId });
                    fileList.splice(0, 1);
                    onGetFileList(fileList);
                    return;
                } else {
                    this.idMap.set(filename, fileId);
                }
            });
        };

        gapi.client.drive.files.list({
            q: `name = '${filename}'`,
            pageSize: 10,
            spaces: GoogleDriveFileKit.folder,
            fields: 'files(id)'
        }).then((response) => {
            const fileList = response.result.files;
            if (!fileList) {
                onGet(null, false);
                return;
            }
            onGetFileList(fileList);
        });
    }

    uploaded(filename, blob, onFinished) {
        // Ref: https://gist.github.com/tanaikech/bd53b366aedef70e35a35f449c51eced
        let url = '';
        let method = '';
        const metadata = {
            name: filename,
            mimeType: FileConst.type,
        };
        // Using parent in Update will cause 403
        if (this.idMap.has(filename)) {
            method = 'PATCH';
            url = `https://www.googleapis.com/upload/drive/v3/files/${this.idMap.get(filename)}?uploadType=multipart`;
        } else {
            method = 'POST';
            url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
            metadata.parents = [ GoogleDriveFileKit.folder ];
        }
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: FileConst.type }));
        form.append('file', blob);
        const authHeader = `Bearer ${gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`;
        fetch(url, {
            method: method,
            headers: new Headers({ Authorization: authHeader }),
            body: form,
        })
            .then(response => response.json())
            .then(response => onFinished(response))
            .catch((_) => onFinished(null));
    }
}

class FileKit {
    constructor() {
        this.local = new LocalFileKit;
        this.googleDrive = new GoogleDriveFileKit();
    }
}

export default FileKit;
export { FileConst };
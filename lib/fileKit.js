const fileKit = {
    local: {
        open: (onLoad) => {
            const element = eliKit.build('input', {
                styleText: 'display:none;',
                type: 'file', accept: 'json'
            });
            const onOpen = (event) => {
                const file = event.target.files[0];
                if (!file) {
                    dialog.alert.open(value.string.alert.openFileFailed);
                    return;
                }
                const fileReader = new FileReader();
                fileReader.onload = () => onLoad(fileReader.result);
                fileReader.readAsText(file);
            };
            element.addEventListener('change', onOpen, false);
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        },
        save: (filename, blob) => {
            const element = eliKit.build('a', {
                styleText: 'display:none;',
                href: URL.createObjectURL(blob),
                download: filename,
            });
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        },
    },
    googleDrive: {
        fileId: { },
        _fileId: null,
        get: (filename, onGet) => {
            const onGetFileList = (fileList) => {
                if (fileList.length < 1) {
                    onGet('', null, false);
                    return;
                }
                const fileId = fileList[0].id;
                gapi.client.drive.files.get({
                    fileId: fileId,
                    alt: "media"
                }).then((response) => {
                    if (!onGet(fileId, response.result, true)) {
                        gapi.client.drive.files.delete({ fileId: fileId });
                        fileList.splice(0, 1);
                        onGetFileList(fileList);
                        return;
                    }
                });
            };

            gapi.client.drive.files.list({
                q: `name = '${filename}'`,
                pageSize: 10,
                spaces: value.string.path.googleDrive.folder,
                fields: 'files(id)'
            }).then((response) => {
                const fileList = response.result.files;
                if (!fileList) {
                    onGet('', null, false);
                    return;
                }
                onGetFileList(fileList);
            });
        },
        uploaded: (filename, fileId, blob, onFinished) => {
            // Ref: https://gist.github.com/tanaikech/bd53b366aedef70e35a35f449c51eced
            let url = '';
            let method = '';
            const metadata = {
                name: filename,
                mimeType: value.string.file.type,
            };
            // Using parent in Update will cause 403
            if (fileId) {
                method = 'PATCH';
                url = `${value.string.path.googleDrive.updateFile}${fileId}${value.string.path.googleDrive.uploadParam}`;
            } else {
                method = 'POST';
                url = value.string.path.googleDrive.createFile;
                metadata.parents = [value.string.path.googleDrive.folder];
            }
            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: value.string.file.type }));
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
        },
    },
};
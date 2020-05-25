const fileKit = {
    local: {
        open: (onload) => {
            const element = document.createElement("input");
            element.type = "file";
            element.accept = ".json";
            const onOpen = (event) => {
                const file = event.target.files[0];
                if (!file) {
                    dialogKit.alert.show(value.string.alert.openFileFailed);
                    return;
                }
                const fileReader = new FileReader();
                fileReader.onload = () => onload(fileReader.result);
                fileReader.readAsText(file);
            };
            element.addEventListener('change', onOpen, false);
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        },
        save: (filename, blob) => {
            const element = document.createElement("a");
            element.href = URL.createObjectURL(blob);
            element.download = filename;
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        },
    },
    googleDrive: {
        _fileId: null,
        getFile: (onFinished) => {
            fileKit.googleDrive._fileId = null;

            const onGetFileList = (fileList) => {
                if (fileList.length < 1) {
                    onFinished();
                    return;
                }
                const fileId = fileList[0].id;
                gapi.client.drive.files.get({
                    fileId: fileId,
                    alt: "media"
                }).then((response) => {
                    if (!process.check.portals(response.result)) {
                        gapi.client.drive.files.delete({ fileId: fileId }).then((response) => console.log(response));
                        fileList.splice(0, 1);
                        onGetFileList(fileList);
                        return;
                    }
                    process.portals.splice(0, process.portals.length);
                    process.portals.push(...response.result);
                    fileKit.googleDrive._fileId = fileId;
                    onFinished();
                });
            };

            gapi.client.drive.files.list({
                q: "name = 'potori.json'",
                pageSize: 10,
                spaces: value.string.path.googleDrive.folder,
                fields: "files(id)"
            }).then((response) => {
                const fileList = response.result.files;
                if (!fileList) {
                    onFinished();
                    return;
                }
                onGetFileList(fileList);
            });
        },
        uploadFile: () => {
            // Ref: https://gist.github.com/tanaikech/bd53b366aedef70e35a35f449c51eced
            let url = "";
            let method = "";
            const metadata = {
                "name": value.string.file.name,
                "mimeType": value.string.file.type,
            };
            // Using parent in Update will cause 403
            if (fileKit.googleDrive._fileId) {
                method = "PATCH";
                url = value.string.path.googleDrive.updateFile + fileKit.googleDrive._fileId + value.string.path.googleDrive.uploadParam;
            } else {
                method = "POST";
                url = value.string.path.googleDrive.createFile;
                metadata.parents = [value.string.path.googleDrive.folder];
            }

            const form = new FormData();
            form.append("metadata", new Blob([JSON.stringify(metadata)], { type: value.string.file.type }));
            form.append("file", process.blob.portals());
            fetch(url, {
                method: method,
                headers: new Headers({
                    "Authorization": "Bearer " + gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token
                }),
                body: form,
            }).then(response => response.json()
            ).then(response => {
                if (response.id) {
                    fileKit.googleDrive._fileId = response.id;
                    dialogKit.alert.show(value.string.alert.uploaded);
                } else {
                    dialogKit.alert.show(value.string.alert.uploadFailed + "\n" + response.message);
                }
            }).catch((_) => dialogKit.alert.show(value.string.alert.uploadFailed));
        },
    },
};
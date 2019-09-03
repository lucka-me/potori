const fileKit = {
    local: {
        openFile: () => {
            const element = document.createElement("input");
            element.type = "file";
            element.accpet = ".json";
            const onOpen = (event) => {
                const file = event.target.files[0];
                if (!file) {
                    ui.dialog.alert.show(value.string.alert.openFileFailed);
                    return;
                }
                const fileReader = new FileReader();
                fileReader.onload = () => fileKit.parseFile(fileReader.result);
                fileReader.readAsText(file);
            };
            element.addEventListener('change', onOpen, false);
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        },
        saveFile: () => {
            if (process.portalList.length < 1) {
                ui.dialog.alert.show(value.string.alert.saveFileNoPortal);
                return;
            }
            const element = document.createElement("a");
            element.href = URL.createObjectURL(fileKit.getFileBlob());
            element.download = value.string.file.name;
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
                    if (!fileKit.checkContent(response.result)) {
                        gapi.client.drive.files.delete({ fileId: fileId }).then((response) => console.log(response));
                        fileList.splice(0, 1);
                        onGetFileList(fileList);
                        return;
                    }
                    process.portalList.splice(0, process.portalList.length);
                    process.portalList.push(...response.result);
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
            form.append("file", fileKit.getFileBlob());
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
                    ui.dialog.alert.show(value.string.alert.uploaded);
                } else {
                    ui.dialog.alert.show(value.string.alert.uploadFailed + "\n" + response.message);
                }
            }).catch((_) => ui.dialog.alert.show(value.string.alert.uploadFailed));
        },
    },
    parseFile: (content) => {
        ui.init();
        process.portalList.splice(0, process.portalList.length);

        const list = [];
        try {
            list = JSON.parse(content);
            if (list.length === 0) {
                ui.dialog.alert.show(value.string.alert.openFileEmpty);
                return;
            }
        } catch(error) {
            ui.dialog.alert.show(value.string.alert.openFileFailed);
            return;
        }
        if (!fileKit.checkContent(list)) {
            ui.dialog.alert.show(value.string.alert.openFileStructError);
            return;
        }
        process.portalList.push(...list);
        ui.appBar.openFile.root_.hidden = true;
        ui.appBar.saveFile.root_.hidden = false;
        process.finish();
    },
    checkContent: (content) => {
        if (content.length === undefined) return false;
        for (let portal of content) {
            if (portal.id === undefined
                || portal.title === undefined
                || portal.image === undefined
                || portal.status === undefined
                || portal.confirmedTime === undefined
                || portal.confirmationMailId === undefined
            ) return false;
        }
        return true;
    },
    getFileBlob: () => {
        const list = [];
        for (let portal of process.portalList) {
            const decyclic = {};
            for (let key of Object.keys(portal)) {
                if (key !== "marker") decyclic[key] = portal[key];
            }
            list.push(decyclic);
        }
        return new Blob([JSON.stringify(list, null, 4)], { type: value.string.file.type });
    },
}
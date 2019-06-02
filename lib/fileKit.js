const fileKit = {
    local: {
        onOpenFile: function() {
            let element = document.createElement("input");
            element.type = "file";
            element.accpet = ".json";
            let onOpen = function(event) {
                let file = event.target.files[0];
                if (!file) {
                    alert(value.string.alert.openFileFailed);
                    return;
                }
                let fileReader = new FileReader();
                fileReader.onload = function() {
                    fileKit.parseFile(fileReader.result);
                };
                fileReader.readAsText(file);
            };
            element.addEventListener('change', onOpen, false);
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        },
        onSaveFile: function() {
            if (portalList.length < 1) {
                alert(value.string.alert.saveFileNoPortal);
                return;
            }
            let file = new Blob([fileKit.getFileContent()], { type: "application/json" });
            let element = document.createElement("a");
            element.href = URL.createObjectURL(file);
            element.download = value.string.path.filename;
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        },
    },
    googleDrive: {
        fileId: null,
        getFile: function() {

        },
        onUploadFile: function() {

        },
    },
    parseFile: function(content) {
        ui.refresh();
        portalList.splice(0, portalList.length);

        let list = [];
        try {
            list = JSON.parse(content);
            if (list.length === 0) {
                alert(value.string.alert.openFileEmpty);
                return;
            }
        } catch(error) {
            alert(value.string.alert.openFileFailed);
            return;
        }
        for (let portal of list) {
            if (portal.id === undefined
                || portal.title === undefined
                || portal.image === undefined
                || portal.status === undefined
                || portal.confirmedTime === undefined
                || portal.confirmationMailId === undefined
            ) {
                console.log(portal);
                alert(value.string.alert.openFileStructError);
                return;
            }
        }
        portalList.push(...list);
        ui.button.openFile.hidden = true;
        ui.button.saveFile.hidden = false;
        display();
    },
    getFileContent: function() {
        let list = [];
        for (let portal of portalList) {
            let decyclic = {};
            for (let key of Object.keys(portal)) {
                decyclic[key] = portal[key];
            }
            list.push(decyclic);
        }
        return JSON.stringify(list, null, 4);
    },
}
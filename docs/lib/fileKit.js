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
            let element = document.createElement("a");
            element.href = URL.createObjectURL(fileKit.getFileBlob());
            element.download = value.string.file.name;
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
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
                alert(value.string.alert.openFileStructError);
                return;
            }
        }
        portalList.push(...list);
        ui.button.openFile.hidden = true;
        ui.button.saveFile.hidden = false;
        display();
    },
    getFileBlob: function() {
        let list = [];
        for (let portal of portalList) {
            let decyclic = {};
            for (let key of Object.keys(portal)) {
                if (key !== "marker") decyclic[key] = portal[key];
            }
            list.push(decyclic);
        }
        return new Blob([JSON.stringify(list, null, 4)], { type: value.string.file.type });
    },
}
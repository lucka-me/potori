const fileKit = {
    onOpenFile: function() {
        let element = document.createElement("input");
        element.type = "file";
        element.accpet = ".json";
        element.addEventListener('change', fileKit.openFile, false);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    },
    openFile: function(event) {
        let file = event.target.files[0];
        if (!file) {
            alert(value.string.alert.openFileFailed);
            return;
        }
        ui.refresh();
        portalList.splice(0, portalList.length);
        let fileReader = new FileReader();
        fileReader.onload = function() {
            let list = [];
            try {
                list = JSON.parse(fileReader.result);
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
        };
        fileReader.readAsText(file)
    },
    onSaveFile: function() {
        if (portalList.length < 1) {
            alert(value.string.alert.saveFileNoPortal);
            return;
        }
        let list = [];
        for (let portal of portalList) {
            let decyclic = {
                id: portal.id,
                title: portal.title,
                image: portal.image,
                status: portal.status,
                confirmedTime: portal.confirmedTime,
                confirmationMailId: portal.confirmationMailId,
            };
            if (portal.lngLat) decyclic.lngLat = portal.lngLat;
            if (portal.resultTime) decyclic.resultTime = portal.resultTime;
            if (portal.resultMailId) decyclic.resultMailId = portal.resultMailId;
            list.push(decyclic);
        }
        let file = new Blob([JSON.stringify(list, null, 4)], { type: "application/json" });
        let element = document.createElement("a");
        element.href = URL.createObjectURL(file);
        element.download = value.string.path.filename;
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    },
}
const process = {
    portalList: [],
    _ignoreMailIdList: [],
    status: {
        list: 0,
        total: 0,
        finished: 0,
    },
    start: () => {
        ui.refresh();
        process.status.list = 0;
        process.status.total = 0;
        process.status.finished = 0;
        ui.appBar.openFile.root_.hidden = true;
        ui.appBar.saveFile.root_.hidden = true;
        ui.progressBar.root_.hidden = false;

        const onGetFileFinished = () => {
            // Ignore the mails those already in the list
            process._ignoreMailIdList  = [];
            for (let portal of process.portalList) {
                process._ignoreMailIdList.push(portal.confirmationMailId);
                if (portal.resultMailId) process._ignoreMailIdList.push(portal.resultMailId);
            }
            for (let scanner of Object.keys(value.string.key.scanner)) {
                for (let type of Object.keys(value.string.key.type)) {
                    process.mails({ scanner: value.string.key.scanner[scanner], type: value.string.key.type[type] });
                }
            }
        };

        fileKit.googleDrive.getFile(onGetFileFinished);        
    },
    finish: () => {
        // Merge duplicated portals
        for (let i = process.portalList.length - 1; i >= 0; i--) {
            const portal = process.portalList[i];

            for (let j = 0; j < i; j++) {
                if (portal.id !== process.portalList[j].id) continue;
                const targetPortal = process.portalList[j];
                if (targetPortal.status === value.code.status.pending) {
                    targetPortal.status = portal.status;
                    targetPortal.lngLat = portal.lngLat;
                    targetPortal.resultTime = portal.resultTime;
                    targetPortal.resultMailId = portal.resultMailId;
                } else {
                    targetPortal.confirmedTime = portal.confirmedTime;
                    targetPortal.confirmationMailId = portal.confirmationMailId;
                    if (!targetPortal.confirmationMailId) {
                        targetPortal.status = portal.status;
                        if (portal.lngLat) targetPortal.lngLat = portal.lngLat;
                    }
                }
                process.portalList.splice(i, 1);
                break;
            }
        }

        // Sort by time
        process.portalList.sort((a, b) => {
            const timeA = a.resultTime ? a.resultTime : a.confirmedTime;
            const timeB = b.resultTime ? b.resultTime : b.confirmedTime;
            return timeA < timeB ? 1 : -1;
        });

        ui.display()
    },
    mails: (keys) => {

        const getListRequest = (pageToken) => {
            return gapi.client.gmail.users.messages.list({
                "userId": "me",
                "q": value.string.mail.query[keys.scanner][keys.type.mail],
                "pageToken": pageToken
            });
        };

        const requestListHandler = (response) => {
            if (response.result.messages) list = list.concat(response.result.messages);
            if (response.result.nextPageToken) {
                const request = getListRequest(response.result.nextPageToken);
                request.execute(requestListHandler);
            } else {
                for (let i = list.length - 1; i >= 0; i--) {
                    for (let mailId of process._ignoreMailIdList) {
                        if (list[i].id === mailId) {
                            list.splice(i, 1);
                            break;
                        }
                    }
                }
                process.status.list += 1;
                ui.progressBar.buffer = process.status.list / 6;
                processMailList(list);
            }
        };

        const processMailList = (list) => {
            process.status.total += list.length;

            const checkFinish = () => {
                if (process.status.list === 6 && process.status.total === process.status.finished) process.finish();
            };

            checkFinish();

            for (let i = 0; i < list.length; i++) {
                const request = gapi.client.gmail.users.messages.get({
                    "userId": "me",
                    "id": list[i].id,
                    "format": "full",
                    "metadataHeaders": ["Subject"]
                });
                request.execute((fullMail) => {
                    process.portalList.push(process.parse.mail(fullMail, keys));
                    process.status.finished += 1;
                    ui.progressBar.progress = process.status.finished / process.status.total * (process.status.list / 6);
                    checkFinish();
                });
            }
        };

        // Begin
        let list = [];
        const listRequest = getListRequest(null);
        listRequest.execute(requestListHandler);
    },
    parse: {
        mail: (fullMail, keys) => {
            const portal = {};
            if (keys.type === value.string.key.type.confirmation) {
                portal.confirmedTime = parseInt(fullMail.internalDate);
                portal.status = value.code.status.pending;
                portal.confirmationMailId = fullMail.id;
            } else {
                portal.resultTime = parseInt(fullMail.internalDate);
                portal.status = value.code.status.accepted;
                portal.resultMailId = fullMail.id;
            }

            // Subject -> Title
            for (let i = 0; i < fullMail.payload.headers.length; i++) {
                const header = fullMail.payload.headers[i];
                if (header.name === "Subject") {
                    const subject = header.value;
                    const hwPos = subject.search(":");
                    const fwPos = subject.search("：");
                    portal.title = subject.slice((fwPos < 0 ? hwPos : (hwPos < 0 ? fwPos : (fwPos < hwPos ? fwPos : hwPos))) + 1).trim();
                    break;
                }
            }

            // Body -> image, id lngLat and rejectReason
            for (let i = 0; i < fullMail.payload.parts.length; i++) {
                const part = fullMail.payload.parts[i];
                if (part.partId === "1") {
                    const mailBody = toolkit.decodeBase64(part.body.data);
                    let imageTmp = mailBody.slice(mailBody.search(/googleusercontent\.com/));
                    for (let keyword of ["\"", "\n"]) {
                        const slicePos = imageTmp.search(keyword);
                        if (slicePos > 0) imageTmp = imageTmp.slice(0, slicePos);
                    }
                    portal.image = imageTmp.replace("googleusercontent.com/", "");
                    portal.id = toolkit.getBsId(portal.image);
                    if (keys.scanner === value.string.key.scanner.redacted && keys.type !== value.string.key.type.confirmation) {
                        portal.lngLat = process.parse.lngLat(mailBody);
                    }
                    if (keys.type === value.string.key.type.rejection) {
                        portal.status = process.parse.rejectedReason(mailBody, keys.scanner);
                    }
                    break;
                }
            }
            return portal;
        },
        rejectedReason: (mailBody, scanner) => {
            const mainBody = mailBody.slice(0, mailBody.search("-NianticOps"));
            let reason = value.code.status.undeclared;
            for (let key of Object.keys(value.string.mail.keyword[scanner].rejectedReason)) {
                for (let keyword of value.string.mail.keyword[scanner].rejectedReason[key]) {
                    if (mainBody.search(keyword) > -1) {
                        reason = value.code.status[key];
                        break;
                    }
                }
                if (reason !== value.code.status.undeclared) break;
            }
            return reason;
        },
        lngLat: (mailBody) => {
            let intel = mailBody.slice(mailBody.search(value.string.path.intel));
            intel = intel.slice(0, intel.search("\">"));
            const lngLatPair = intel.slice(intel.search("ll=") + 3, intel.search("&z=18")).split(",");
            return {
                lng: parseFloat(lngLatPair[1]),
                lat: parseFloat(lngLatPair[0])
            };
        },
    },
};
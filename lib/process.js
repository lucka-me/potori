const process = {
    portalList: [],
    _ignoreMailIdList: [],
    progress: { list: 0, total: 0, finished: 0, },
    start: () => {
        ui.refresh();
        process.progress.list = 0;
        process.progress.total = 0;
        process.progress.finished = 0;
        ui.appBar.button.openFile.root_.hidden = true;
        ui.appBar.button.saveFile.root_.hidden = true;
        ui.progressBar.root_.hidden = false;

        const onGetFileFinished = () => {
            // Ignore the mails those already in the list
            process._ignoreMailIdList  = [];
            for (const portal of process.portalList) {
                process._ignoreMailIdList.push(portal.confirmationMailId);
                if (portal.resultMailId) process._ignoreMailIdList.push(portal.resultMailId);
            }
            for (const scanner of value.string.key.scanner) {
                for (const type of value.string.key.type) {
                    process.mails({ scanner: scanner, type: type });
                }
            }
        };

        fileKit.googleDrive.getFile(onGetFileFinished);
    },
    finish: () => {
        // Merge duplicated portals -> targetPortals
        for (let i = process.portalList.length - 1; i >= 0; i--) {
            const portal = process.portalList[i];

            for (let j = 0; j < i; j++) {
                if (portal.id !== process.portalList[j].id) continue;
                const targetPortal = process.portalList[j];
                if (targetPortal.resultMailId) {
                    targetPortal.confirmedTime = portal.confirmedTime;
                    targetPortal.confirmationMailId = portal.confirmationMailId;
                    if (!targetPortal.lngLat) targetPortal.lngLat = portal.lngLat;
                } else {
                    targetPortal.status = portal.status;
                    targetPortal.lngLat = portal.lngLat;
                    targetPortal.resultTime = portal.resultTime;
                    targetPortal.resultMailId = portal.resultMailId;
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
                'userId': 'me',
                'q': value.data.type[keys.type].query[keys.scanner],
                'pageToken': pageToken
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
                process.progress.list += 1;
                ui.progressBar.buffer = process.progress.list / 6;
                processMailList(list);
            }
        };

        const processMailList = (list) => {
            process.progress.total += list.length;

            const checkFinish = () => {
                if (process.progress.list === 6 && process.progress.total === process.progress.finished) {
                    process.finish();
                }
            };

            checkFinish();

            for (let i = 0; i < list.length; i++) {
                const request = gapi.client.gmail.users.messages.get({
                    'userId': 'me',
                    'id': list[i].id,
                    'format': 'full',
                    'metadataHeaders': ['Subject']
                });
                request.execute((fullMail) => {
                    process.portalList.push(process.parse.mail(fullMail, keys));
                    process.progress.finished += 1;
                    ui.progressBar.progress =
                        process.progress.finished / process.progress.total * (process.progress.list / 6);
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
            const portal = { status: value.data.type[keys.type].code, };
            if (keys.type === 'pending') {
                portal.confirmedTime = parseInt(fullMail.internalDate);
                portal.confirmationMailId = fullMail.id;
            } else {
                portal.resultTime = parseInt(fullMail.internalDate);
                portal.resultMailId = fullMail.id;
            }

            // Subject -> Title
            for (let i = 0; i < fullMail.payload.headers.length; i++) {
                const header = fullMail.payload.headers[i];
                if (header.name === 'Subject') {
                    const subject = header.value;
                    const hwPos = subject.search(':');
                    const fwPos = subject.search('：');
                    portal.title = subject
                        .slice((fwPos < 0 ? hwPos : (hwPos < 0 ? fwPos : (fwPos < hwPos ? fwPos : hwPos))) + 1)
                        .trim();
                    break;
                }
            }

            // Body -> image, id lngLat and rejectReason
            for (let i = 0; i < fullMail.payload.parts.length; i++) {
                const part = fullMail.payload.parts[i];
                if (part.partId === '1') {
                    const mailBody = toolkit.decodeBase64(part.body.data);
                    let imageTmp = mailBody.slice(mailBody.search(/googleusercontent\.com/));
                    for (const keyword of ['"', '\n']) {
                        const slicePos = imageTmp.search(keyword);
                        if (slicePos > 0) imageTmp = imageTmp.slice(0, slicePos);
                    }
                    portal.image = imageTmp.replace('googleusercontent.com/', '');
                    portal.id = toolkit.getBsId(portal.image);
                    if (keys.scanner === 'redacted' && keys.type !== 'pending') {
                        portal.lngLat = process.parse.lngLat(mailBody);
                    }
                    if (keys.type === 'rejected') {
                        portal.status = process.parse.rejectedReason(mailBody, keys.scanner);
                    }
                    break;
                }
            }
            return portal;
        },
        rejectedReason: (mailBody, scanner) => {
            const mainBody = mailBody.slice(0, mailBody.search('-NianticOps'));
            let reason = value.data.rejectedReason.undeclared.code;
            for (const key of Object.keys(value.data.rejectedReason)) {
                for (const keyword of value.data.rejectedReason[key].keyword[scanner]) {
                    if (mainBody.search(keyword) > -1) {
                        reason = value.data.rejectedReason[key].code;
                        break;
                    }
                }
                if (reason !== value.data.rejectedReason.undeclared.code) break;
            }
            return reason;
        },
        lngLat: (mailBody) => {
            let intel = mailBody.slice(mailBody.search(value.string.path.intel));
            intel = intel.slice(0, intel.search('">'));
            const lngLatPair = intel.slice(intel.search('ll=') + 3, intel.search('&z=18')).split(',');
            return {
                lng: parseFloat(lngLatPair[1]),
                lat: parseFloat(lngLatPair[0])
            };
        },
    },
    import: (raw) => {
        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch (error) {
            dialogKit.alert.show(value.string.alert.invalidData);
            return;
        }
        if (!parsed.result || parsed.result.length < 1) {
            dialogKit.alert.show(value.string.alert.invalidData);
        }
        const mapPortal = new Map();
        for (const portal of process.portalList) {
            mapPortal.set(portal.id, portal);
        }
        for (const nomination of parsed.result) {
            const imageUrl = nomination.imageUrl.replace('https://lh3.googleusercontent.com/', '');
            const id = toolkit.getBsId(imageUrl);
            if (!mapPortal.has(id)) continue;

            const portal = mapPortal.get(id);
            portal.title = nomination.title;
            portal.lngLat = {
                lng: parseFloat(nomination.lng),
                lat: parseFloat(nomination.lat)
            };
        }
        ui.display();
    },
};
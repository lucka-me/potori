const mariKit = {
    _ignoreMailIdList: [],
    progress: { list: 0, total: 0, finished: 0, },
    start: () => {
        ui.clear();
        mariKit.progress.list = 0;
        mariKit.progress.total = 0;
        mariKit.progress.finished = 0;
        ui.appBar.menu.item.openFile.hidden = true;
        ui.appBar.menu.item.saveFile.hidden = true;
        ui.progress.ctrl.root_.hidden = false;

        const onDownloadFinished = () => {
            // Ignore the mails those already in the list
            mariKit._ignoreMailIdList  = [];
            for (const portal of process.portals) {
                mariKit._ignoreMailIdList.push(portal.confirmationMailId);
                if (portal.resultMailId) mariKit._ignoreMailIdList.push(portal.resultMailId);
            }
            for (const scanner of value.string.key.scanner) {
                for (const type of value.string.key.type) {
                    mariKit.mails({ scanner: scanner, type: type });
                }
            }
        };
        process.download(onDownloadFinished);
    },
    mails: (keys) => {

        const list = [];

        const getListRequest = (pageToken) => {
            return gapi.client.gmail.users.messages.list({
                'userId': 'me',
                'q': value.data.type[keys.type].query[keys.scanner],
                'pageToken': pageToken
            });
        };

        const requestListHandler = (response) => {
            if (response.result.messages) list.push(...response.result.messages);
            if (response.result.nextPageToken) {
                const request = getListRequest(response.result.nextPageToken);
                request.execute(requestListHandler);
            } else {
                for (let i = list.length - 1; i >= 0; i--) {
                    for (let mailId of mariKit._ignoreMailIdList) {
                        if (list[i].id === mailId) {
                            list.splice(i, 1);
                            break;
                        }
                    }
                }
                mariKit.progress.list += 1;
                ui.progress.ctrl.buffer = mariKit.progress.list / 6;
                processMailList(list);
            }
        };

        const processMailList = (list) => {
            mariKit.progress.total += list.length;

            const checkFinish = () => {
                if (mariKit.progress.list === 6 && mariKit.progress.total === mariKit.progress.finished) {
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
                    process.portals.push(mariKit.parse.mail(fullMail, keys));
                    mariKit.progress.finished += 1;
                    ui.progress.ctrl.progress =
                        mariKit.progress.finished / mariKit.progress.total * (mariKit.progress.list / 6) * 0.9;
                    checkFinish();
                });
            }
        };

        // Begin
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
                    const mailBody = mariKit.decodeBase64(part.body.data);
                    let imageTmp = mailBody.slice(mailBody.search(/googleusercontent\.com/));
                    for (const keyword of ['"', '\n']) {
                        const slicePos = imageTmp.search(keyword);
                        if (slicePos > 0) imageTmp = imageTmp.slice(0, slicePos);
                    }
                    portal.image = imageTmp.replace('googleusercontent.com/', '');
                    portal.id = bsKit.getId(portal.image);
                    if (keys.scanner === 'redacted' && keys.type !== 'pending') {
                        portal.lngLat = mariKit.parse.lngLat(mailBody);
                    }
                    if (keys.type === 'rejected') {
                        portal.status = mariKit.parse.reason(mailBody, keys.scanner);
                    }
                    break;
                }
            }
            return portal;
        },
        reason: (mailBody, scanner) => {
            const mainBody = mailBody.slice(0, mailBody.search('-NianticOps'));
            let reason = value.data.reason.undeclared.code;
            for (const key of Object.keys(value.data.reason)) {
                for (const keyword of value.data.reason[key].keyword[scanner]) {
                    if (mainBody.search(keyword) > -1) {
                        reason = value.data.reason[key].code;
                        break;
                    }
                }
                if (reason !== value.data.reason.undeclared.code) break;
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
    
    // Decode Base64
    // Ref: https://nelluil.postach.io/post/btoa-atob-zhi-yuan-zhong-wen-de-fang-fa
    // Ref: https://cnodejs.org/topic/4fd6b7ba839e1e581407aac8
    decodeBase64: (text) => unescape(decodeURIComponent(escape(window.atob(text.replace(/\-/g, "+").replace(/\_/g, "/"))))),
}
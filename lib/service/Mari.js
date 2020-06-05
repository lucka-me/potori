import { BrainstormingKit } from "./BrainstormingKit.js";

class Parser {
    static mail(fullMail, keys) {
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
        for (const part of fullMail.payload.parts) {
            if (part.partId === '1') {
                const mailBody = this.base64(part.body.data);
                let imageTmp = mailBody.slice(mailBody.search(/googleusercontent\.com/));
                for (const keyword of ['"', '\n']) {
                    const slicePos = imageTmp.search(keyword);
                    if (slicePos > 0) imageTmp = imageTmp.slice(0, slicePos);
                }
                portal.image = imageTmp.replace('googleusercontent.com/', '');
                portal.id = BrainstormingKit.getId(portal.image);
                if (keys.scanner === 'redacted' && keys.type !== 'pending') {
                    portal.lngLat = this.lngLat(mailBody);
                }
                if (keys.type === 'rejected') {
                    portal.status = this.reason(mailBody, keys.scanner);
                }
                break;
            }
        }
        return portal;
    }

    static reason(mailBody, scanner) {
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
    }

    static lngLat(mailBody) {
        let intel = mailBody.slice(mailBody.search(value.string.path.intel));
        intel = intel.slice(0, intel.search('">'));
        const lngLatPair = intel.slice(intel.search('ll=') + 3, intel.search('&z=18')).split(',');
        return {
            lng: parseFloat(lngLatPair[1]),
            lat: parseFloat(lngLatPair[0])
        };
    }

    // Decode Base64
    // Ref: https://nelluil.postach.io/post/btoa-atob-zhi-yuan-zhong-wen-de-fang-fa
    // Ref: https://cnodejs.org/topic/4fd6b7ba839e1e581407aac8
    static base64(text) {
        return unescape(
            decodeURIComponent(
                escape(window.atob(text.replace(/\-/g, "+").replace(/\_/g, "/")))
            )
        );
    }
}

class Mari {
    constructor() {
        this.ignoreMailIdList = [];
        this.portals = [];
        this.progress = {
            list: 0, total: 0, finished: 0,
        };
        this.finished = () => {};

        this.bufferUpdate   = (percent) => percent;
        this.progressUpdate = (percent) => percent;
    }

    start(portals, finished) {
        this.portals = portals;
        this.finished = finished;

        this.progress.list = 0;
        this.progress.total = 0;
        this.progress.finished = 0;

        // Ignore the mails those already in the list
        this.ignoreMailIdList  = [];
        for (const portal of this.portals) {
            this.ignoreMailIdList.push(portal.confirmationMailId);
            if (portal.resultMailId) this.ignoreMailIdList.push(portal.resultMailId);
        }
        for (const scanner of value.string.key.scanner) {
            for (const type of value.string.key.type) {
                this.query({ scanner: scanner, type: type });
            }
        }
    }

    query(keys) {

        const list = [];
        const listRequest = this.getListRequest(null, keys);
        listRequest.execute((response) => {
            this.handleListRequest(response, keys, list);
        });
    }

    getListRequest(pageToken, keys) {
        return gapi.client.gmail.users.messages.list({
            'userId': 'me',
            'q': value.data.type[keys.type].query[keys.scanner],
            'pageToken': pageToken
        });
    }

    handleListRequest(response, keys, list) {
        if (response.result.messages) list.push(...response.result.messages);
            if (response.result.nextPageToken) {
                const request = this.getListRequest(response.result.nextPageToken, keys);
                request.execute((newResponse) => {
                    this.handleListRequest(newResponse, keys, list);
                });
            } else {
                for (let i = list.length - 1; i >= 0; i--) {
                    for (let mailId of this.ignoreMailIdList) {
                        if (list[i].id === mailId) {
                            list.splice(i, 1);
                            break;
                        }
                    }
                }
                this.progress.list += 1;
                this.bufferUpdate(this.progress.list / 6);
                this.processList(keys, list);
            }
    }

    processList(keys, list) {
        this.progress.total += list.length;

        const checkFinish = () => {
            if (this.progress.list === 6 && this.progress.total === this.progress.finished) {
                this.finished();
            }
        };

        checkFinish();

        for (const mail of list) {
            const request = gapi.client.gmail.users.messages.get({
                'userId': 'me',
                'id': mail.id,
                'format': 'full',
                'metadataHeaders': ['Subject']
            });
            request.execute((fullMail) => {
                this.portals.push(Parser.mail(fullMail, keys));
                this.progress.finished += 1;
                this.progressUpdate(
                    this.progress.finished / this.progress.total * (this.progress.list / 6)
                );
                checkFinish();
            });
        }
    }
}

export { Mari };
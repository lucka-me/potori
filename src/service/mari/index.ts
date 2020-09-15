import statusKit from '../status';
import Nomination, { LngLat } from '../nomination';

interface QueryKeys {
    scanner: string;
    type: string;
}

class Parser {
    static mail(mail: gapi.client.gmail.Message, keys: QueryKeys) {
        const nomination = new Nomination();
        nomination.status = statusKit.types.get(keys.type);
        if (keys.type === 'pending') {
            nomination.confirmedTime = parseInt(mail.internalDate);
            nomination.confirmationMailId = mail.id;
        } else {
            nomination.resultTime = parseInt(mail.internalDate);
            nomination.resultMailId = mail.id;
        }

        // Subject -> Title
        for (let i = 0; i < mail.payload.headers.length; i++) {
            const header = mail.payload.headers[i];
            if (header.name === 'Subject') {
                const subject = header.value;
                const hwPos = subject.search(':');
                const fwPos = subject.search('：');
                nomination.title = subject
                    .slice((fwPos < 0 ? hwPos : (hwPos < 0 ? fwPos : (fwPos < hwPos ? fwPos : hwPos))) + 1)
                    .trim();
                break;
            }
        }

        // Body -> image, id lngLat and rejectReason
        for (const part of mail.payload.parts) {
            if (part.partId === '1') {
                const mailBody = this.base64(part.body.data);
                let imageTmp = mailBody.slice(mailBody.search(/googleusercontent\.com/));
                for (const keyword of ['"', '\n', '</p>']) {
                    const slicePos = imageTmp.search(keyword);
                    if (slicePos > 0) imageTmp = imageTmp.slice(0, slicePos);
                }
                nomination.image = imageTmp.replace('googleusercontent.com/', '');
                nomination.id = Nomination.parseId(nomination.image);
                if (keys.scanner === 'redacted' && keys.type !== 'pending') {
                    nomination.lngLat = this.lngLat(mailBody);
                }
                if (keys.type === 'rejected') {
                    nomination.status = this.reason(mailBody, keys.scanner);
                }
                break;
            }
        }
        return nomination;
    }

    static reason(mailBody: string, scanner: string) {
        const mainBody = mailBody.slice(0, mailBody.search('-NianticOps'));
        const undeclared = statusKit.reasons.get('undeclared');
        // Get first result
        let result = undeclared;
        let firstPos = mailBody.length;
        for (const reason of statusKit.reasons.values()) {
            for (const keyword of reason.keywords.get(scanner)) {
                const pos = mainBody.search(keyword);
                if (pos > -1 && pos < firstPos) {
                    result = reason;
                    firstPos = pos;
                    break;
                }
            }
        }
        return result;
    }

    static lngLat(mailBody: string): LngLat {
        let intel = mailBody.slice(mailBody.search('https://www.ingress.com/intel'));
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
    static base64(text: string) {
        return unescape(
            decodeURIComponent(
                escape(window.atob(text.replace(/\-/g, '+').replace(/\_/g, '/')))
            )
        );
    }
}

interface MariEvents {
    finished: () => void;
    bufferUpdate: (percent: number) => void;
    progressUpdate: (percent: number) => void,
}

interface MariProgress {
    list: number, total: number, finished: number,
}

class Mari {

    private types: Array<string> = [];

    private scanners: Array<string> = [];
    private ignoreMailIdList: Array<string> = [];
    nominations: Array<Nomination> = [];
    progress: MariProgress = {
        list: 0, total: 0, finished: 0,
    };
    events: MariEvents = {
        finished: () => {},
        bufferUpdate: () => {},
        progressUpdate: () => {},
    };

    constructor() {
        for (const type of statusKit.types.keys()) {
            this.types.push(type);
        }
        for (const scanner of statusKit.types.get(this.types[0]).queries.keys()) {
            this.scanners.push(scanner);
        }
    }

    start(nominations: Array<Nomination>) {
        this.nominations = nominations;

        this.progress.list = 0;
        this.progress.total = 0;
        this.progress.finished = 0;

        // Ignore the mails those already in the list
        this.ignoreMailIdList  = [];
        for (const nomination of this.nominations) {
            this.ignoreMailIdList.push(nomination.confirmationMailId);
            if (nomination.resultMailId) this.ignoreMailIdList.push(nomination.resultMailId);
        }
        for (const scanner of this.scanners) {
            for (const type of this.types) {
                this.query({ scanner: scanner, type: type });
            }
        }
    }

    query(keys: QueryKeys) {

        const list: Array<gapi.client.gmail.Message> = [];
        const listRequest = this.getListRequest(null, keys);
        listRequest.execute((response) => {
            this.handleListRequest(response, keys, list);
        });
    }

    getListRequest(pageToken: string, keys: QueryKeys) {
        return gapi.client.gmail.users.messages.list({
            'userId': 'me',
            'q': statusKit.types.get(keys.type).queries.get(keys.scanner),
            'pageToken': pageToken
        });
    }

    handleListRequest(
        response: gapi.client.Response<gapi.client.gmail.ListMessagesResponse>,
        keys: QueryKeys, list: Array<gapi.client.gmail.Message>
    ) {
        if (response.result.messages) {
            list.push(...response.result.messages);
        }
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
            this.events.bufferUpdate(this.progress.list / this.scanners.length);
            this.processList(keys, list);
        }
    }

    processList(keys: QueryKeys, list: Array<gapi.client.gmail.Message>) {
        this.progress.total += list.length;

        const checkFinish = () => {
            if (this.progress.list === this.scanners.length * this.types.length
                && this.progress.total === this.progress.finished) {
                this.events.finished();
            }
        };

        checkFinish();

        for (const mail of list) {
            gapi.client.gmail.users.messages.get({
                userId: 'me',
                id: mail.id,
                format: 'full',
                metadataHeaders: 'Subject'
            }).execute((response: gapi.client.Response<gapi.client.gmail.Message>) => {
                this.nominations.push(Parser.mail(response.result, keys));
                this.progress.finished += 1;
                this.events.progressUpdate(
                    this.progress.finished / this.progress.total * (this.progress.list / this.scanners.length)
                );
                checkFinish();
            });
        }
    }
}

export default Mari;
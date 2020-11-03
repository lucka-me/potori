import i18next from 'i18next';

import { service } from 'service';
import Nomination from 'service/nomination';

import Parser from './tools';

type MessageCallback = (message: string) => void;
type FinishCallback = () => void;
export type ProgressCallback = (percent: number) => void;

/**
 * Events for {@link Mari}
 */
interface MariEvents {
    alert:      MessageCallback;    // Triggered when alert should be displayed
    buffer:     ProgressCallback;   // Triggered when buffer (secondary progress) updates
    progress:   ProgressCallback,   // Triggered when main progress update
    finish:     FinishCallback;     // Triggered when processes all finish
}

/**
 * Progress of {@link Mari} process
 */
interface Progress {
    list: number,       // Number of mail lists
    total: number,      // Number of mails
    finished: number,   // Number of finished mails
}

/**
 * Query and process mails
 */
export default class Mari {

    private scanners: Array<string> = [];           // List of scanner keys
    private types: Array<string> = [];              // List of type keys

    private ignoreMailIds: Array<string> = [];      // List of ids of mails that should be ignored
    private nominations: Array<Nomination> = [];    // List of nominations

    private progress: Progress = {
        list: 0, total: 0, finished: 0,
    };

    events: MariEvents = {
        alert:  () => {},
        finish: () => {},
        buffer: () => {},
        progress: () => {},
    };

    /**
     * Initiate Mari
     */
    init() {
        for (const type of service.status.types.keys()) {
            this.types.push(type);
        }
        for (const scanner of service.status.types.get(this.types[0]).queries.keys()) {
            this.scanners.push(scanner);
        }
    }

    /**
     * Start the process
     * @param nominations Existing nominations
     */
    start(nominations: Array<Nomination>) {
        this.nominations = nominations;

        this.progress.list = 0;
        this.progress.total = 0;
        this.progress.finished = 0;

        // Ignore the mails already in the list
        this.ignoreMailIds  = [];
        for (const nomination of this.nominations) {
            this.ignoreMailIds.push(nomination.confirmationMailId);
            if (nomination.resultMailId) this.ignoreMailIds.push(nomination.resultMailId);
        }
        for (const scanner of this.scanners) {
            for (const type of this.types) {
                const keys: QueryKeys = { scanner: scanner, type: type };
                const listRequest = Mari.getListRequest(null, keys);
                listRequest.execute((response) => {
                    this.handleListRequest(response, keys, []);
                });
            }
        }
    }

    /**
     * Generate a request for mail list
     * @param pageToken Token for target page
     * @param keys Query keys to get query string
     */
    private static getListRequest(pageToken: string, keys: QueryKeys) {
        return gapi.client.gmail.users.messages.list({
            'userId': 'me',
            'q': service.status.types.get(keys.type).queries.get(keys.scanner),
            'pageToken': pageToken
        });
    }

    /**
     * Handle the respose of mail list request, request next page or goto next step
     * @param response Response of the request
     * @param keys Keys of the scanner-type group
     * @param list Mail list
     */
    private handleListRequest(
        response: gapi.client.Response<gapi.client.gmail.ListMessagesResponse>,
        keys: QueryKeys, list: Array<gapi.client.gmail.Message>
    ) {
        if (response.result.messages) {
            list.push(...response.result.messages);
        }
        if (response.result.nextPageToken) {
            const request = Mari.getListRequest(response.result.nextPageToken, keys);
            request.execute((newResponse) => {
                this.handleListRequest(newResponse, keys, list);
            });
        } else {
            for (let i = list.length - 1; i >= 0; i--) {
                for (const mailId of this.ignoreMailIds) {
                    if (list[i].id === mailId) {
                        list.splice(i, 1);
                        break;
                    }
                }
            }
            this.progress.list += 1;
            this.events.buffer(this.progress.list / this.scanners.length);
            this.processList(keys, list);
        }
    }

    /**
     * Process mail (id) list
     * @param keys Keys of the scanner-type group
     * @param list Complete mail list
     */
    private processList(keys: QueryKeys, list: Array<gapi.client.gmail.Message>) {
        this.progress.total += list.length;

        const checkFinish = () => {
            if (this.progress.list === this.scanners.length * this.types.length
                && this.progress.total === this.progress.finished) {
                this.events.finish();
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
                const fullMail = response.result;
                try {
                    const nomination = Parser.mail(fullMail, keys);
                    this.nominations.push(nomination);
                } catch (error: Error | any) {
                    let subject = '';
                    for (let i = 0; i < fullMail.payload.headers.length; i++) {
                        const header = fullMail.payload.headers[i];
                        if (header.name === 'Subject') {
                            subject = header.value;
                            break;
                        }
                    }
                    let details: string = error;
                    if ('message' in error) {
                        const typedError = error.error as Error;
                        details = typedError.stack || typedError.message;
                    }
                    this.events.alert(i18next.t('message:service.mari.reportParserError', {
                        subject: subject,
                        message: `[${keys.scanner}:${keys.type}]${details}`
                    }));
                }

                this.progress.finished += 1;
                this.events.progress(
                    this.progress.finished / this.progress.total * (this.progress.list / this.scanners.length)
                );
                checkFinish();
            });
        }
    }
}

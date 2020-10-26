import { service } from 'service';
import Nomination from 'service/nomination';

import Parser from './tools';

type FinishCallback = () => void;
export type ProgressCallback = (percent: number) => void;

/**
 * Events for {@link Mari}
 */
interface MariEvents {
    finish:     FinishCallback;     // Triggered when processes all finish
    buffer:     ProgressCallback;   // Triggered when buffer (secondary progress) updates
    progress:   ProgressCallback,   // Triggered when main progress update
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

    private types: Array<string> = [];          // List of type keys
    private scanners: Array<string> = [];       // List of scanner keys
    private ignoreMailIds: Array<string> = [];  // List of ids of mails that should be ignored
    nominations: Array<Nomination> = [];        // List of nominations
    progress: Progress = {
        list: 0, total: 0, finished: 0,
    };
    events: MariEvents = {
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
            //this.ignoreMailIds.push(nomination.confirmationMailId);
            //if (nomination.resultMailId) this.ignoreMailIds.push(nomination.resultMailId);
        }
        for (const scanner of this.scanners) {
            for (const type of this.types) {
                this.query({ scanner: scanner, type: type });
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
     * Query a group of scanner-type mails
     * @param keys Keys of the scanner-type group
     */
    private query(keys: QueryKeys) {

        const list: Array<gapi.client.gmail.Message> = [];
        const listRequest = Mari.getListRequest(null, keys);
        listRequest.execute((response) => {
            this.handleListRequest(response, keys, list);
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
                for (let mailId of this.ignoreMailIds) {
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
                try {
                    const nomination = Parser.mail(response.result, keys);
                    this.nominations.push(nomination);
                } catch (error) {
                    // Should report the mail
                    console.log(`${keys.scanner}:${keys.type}`);
                    console.log(response.result);
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
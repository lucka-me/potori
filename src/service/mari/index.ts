import { umi } from '@/service/umi';
import Nomination from '@/service/nomination';

import { parser } from './parser';

type BasicCallback = () => void;
type MessageCallback = (message: string) => void;
type FinishCallback = (nominations: Array<Nomination>) => void;
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
 * Item of {@link Progress}
 */
class ProgressItem {
    total: number = 0;
    finished: number = 0;

    clear() {
        this.total = 0;
        this.finished = 0;
    }

    /**
     * Detect if the progress is not 100%
     */
    get left() {
        return this.finished < this.total;
    }

    /**
     * The percentage of progress
     */
    get percent() {
        return this.total === 0 ? 0.0 : (this.finished / this.total);
    }
}

/**
 * Manage the progress of mail processing
 */
class Progress {

    lists = new ProgressItem();
    messages = new ProgressItem();

    onBuffer    : ProgressCallback  = () => { };    // Triggered when a list finished
    onProgress  : ProgressCallback  = () => { };    // Triggered when a message finished if all lists are finished
    onFinish    : BasicCallback     = () => { };    // Triggered when all lists and messages are finished

    /**
     * Clear all progress
     */
    clear() {
        this.lists.clear();
        this.messages.clear();
    }

    /**
     * Add a WIP list
     */
    addList() {
        this.lists.total += 1;
    }

    /**
     * Finish a list and check finish
     * @param messages Count of the messages to process
     */
    finishList(messages: number) {
        this.lists.finished += 1;
        this.messages.total += messages;
        this.onBuffer(this.lists.percent);
        if (!this.left) {
            this.onFinish();
        }
    }

    /**
     * Finish a message and check finish
     */
    finishMessage() {
        this.messages.finished += 1;
        if (!this.lists.left) {
            this.onProgress(this.messages.percent);
            if (!this.left) {
                this.onFinish();
            }
        }
    }

    /**
     * Detect if there is list or message left
     */
    private get left() {
        return this.lists.left || this.messages.left;
    }
}

/**
 * Query and process mails
 */
export default class Mari {

    private ignoreMailIds: Array<string> = [];      // List of ids of mails that should be ignored
    private nominations: Array<Nomination> = [];    // List of nominations

    private progress = new Progress();  // Progress manager

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
        this.progress.onBuffer = (percent) => {
            this.events.buffer(percent);
        }
        this.progress.onProgress = (percent) => {
            this.events.progress(percent);
        }
        this.progress.onFinish = () => {
            this.events.finish(this.nominations);
        }
    }

    /**
     * Start the process
     * @param nominations Existing nominations
     */
    start(nominations: Array<Nomination>) {
        this.nominations = nominations.map(nomination => nomination);
        this.progress.lists.clear();
        this.progress.messages.clear();

        // Ignore the mails already in the list
        this.ignoreMailIds = this.nominations.flatMap(nomination => {
            return nomination.resultMailId.length > 0 ? [ nomination.confirmationMailId, nomination.resultMailId ] : [ nomination.confirmationMailId ];
        });
        for (const status of umi.status.values()) {
            for (const scanner of status.queries.keys()) {
                this.queryList(status.code, scanner);
            }
        }
    }

    /**
     * Start to query message list
     * @param status Status to query
     * @param scanner Scanner to query
     */
    private queryList(status: umi.StatusCode, scanner: umi.ScannerCode) {
        this.progress.addList();
        const listRequest = Mari.getListRequest(undefined, status, scanner);
        listRequest.execute((response) => {
            this.handleListRequest(response, [], status, scanner);
        });
    }

    /**
     * Generate a request for mail list
     * @param pageToken Token for target page
     * @param status Status to query
     * @param scanner Scanner to query, must exist in the `queries` of the status
     */
    private static getListRequest(pageToken: string | undefined, status: umi.StatusCode, scanner: umi.ScannerCode) {
        return gapi.client.gmail.users.messages.list({
            userId: 'me',
            q: umi.status.get(status)!.queries.get(scanner)!,
            pageToken: pageToken
        });
    }

    /**
     * Handle the respose of mail list request, request next page or goto next step
     * @param response Response of the request
     * @param list Mail list
     * @param status Status of the list
     * @param scanner Scanner of the list
     */
    private handleListRequest(
        response: gapi.client.Response<gapi.client.gmail.ListMessagesResponse>,
        list: Array<gapi.client.gmail.Message>,
        status: umi.StatusCode,
        scanner: umi.ScannerCode
    ) {
        if (response.result.messages) {
            list.push(...response.result.messages);
        }
        if (response.result.nextPageToken) {
            const request = Mari.getListRequest(response.result.nextPageToken, status, scanner);
            request.execute((newResponse) => {
                this.handleListRequest(newResponse, list, status, scanner);
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
            this.queryMessages(list, status, scanner);
        }
    }

    /**
     * Process mail (id) list
     * @param list Complete mail list
     * @param status Status of the list
     * @param scanner Scanner of the list
     */
    private queryMessages(list: Array<gapi.client.gmail.Message>, status: umi.StatusCode, scanner: umi.ScannerCode) {
        this.progress.finishList(list.length);

        for (const mail of list) {
            if (!mail.id) continue;
            gapi.client.gmail.users.messages.get({
                userId: 'me',
                id: mail.id,
                format: 'full',
                metadataHeaders: 'Subject'
            }).execute((response: gapi.client.Response<gapi.client.gmail.Message>) => {
                const fullMail = response.result;
                try {
                    const nomination = parser.parse(fullMail, status, scanner);
                    this.nominations.push(nomination);
                } catch (error) {
                    let subject = '';
                    for (const header of fullMail.payload!.headers!) {
                        if (header.name === 'Subject') {
                            subject = header.value!;
                            break;
                        }
                    }
                    let details: string = error;
                    if ('message' in error) {
                        const typedError = error as Error;
                        details = typedError.stack || typedError.message;
                    }
                    // this.events.alert(i18next.t('message:service.mari.reportParserError', {
                    //     subject: subject,
                    //     message: `[${keys.scanner}:${keys.status}]${details}`
                    // }));
                    this.events.alert(`message:service.mari.reportParserError ${subject} [${status}:${scanner}]${details}`);
                }

                this.progress.finishMessage();
            });
        }
    }
}

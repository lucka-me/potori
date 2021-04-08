import { preferences } from '@/service/preferences';
import { umi } from '@/service/umi';
import { MessageCallback, ProgressCallback } from '@/service/types';
import Nomination, { NominationData } from '@/service/nomination';

import { parser } from './parser';

/**
 * Events for {@link Mari}
 */
interface MariEvents {
    alert:      MessageCallback;    // Triggered when alert should be displayed
    progress:   ProgressCallback,   // Triggered when main progress update
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
}

/**
 * Manage the progress of mail processing
 */
class Progress {

    lists = new ProgressItem();
    messages = new ProgressItem();

    onProgress  : ProgressCallback  = () => { };    // Triggered when a message finished if all lists are finished

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
        this.onProgress(0, this.lists.total);
    }

    /**
     * Finish a list and check finish
     * @param messages Count of the messages to process
     */
    finishList(messages: number) {
        this.lists.finished += 1;
        this.messages.total += messages;
        this.onProgress(this.lists.finished, this.lists.total);
    }

    /**
     * Finish a message and check finish
     */
    finishMessage() {
        this.messages.finished += 1;
        if (!this.lists.left) {
            this.onProgress(this.messages.finished, this.messages.total);
        }
    }
}

/**
 * Query and process mails
 */
export default class Mari {

    private queryAfter: string = '';
    private ignoreIds: Array<string> = [];      // List of ids of mails that should be ignored
    private nominations: Array<Nomination> = [];    // List of nominations

    private progress = new Progress();  // Progress manager

    events: MariEvents = {
        alert:  () => {},
        progress: () => {},
    };

    constructor() {
        this.progress.onProgress = (progress, max) => this.events.progress(progress, max);
    }

    /**
     * Start the process
     * @param nominations Existing nominations
     */
    async start(nominations: Array<NominationData>) {
        this.nominations.length = 0;
        this.progress.lists.clear();
        this.progress.messages.clear();

        // Ignore the mails already in the list
        this.ignoreIds = nominations.flatMap(nomination => {
            return nomination.resultMailId.length > 0 
                ? [ nomination.confirmationMailId, nomination.resultMailId ] : [ nomination.confirmationMailId ];
        });
        if (preferences.general.queryAfterLatest()) {
            const latest = Math.floor(this.nominations.reduce((time, nomination) => {
                return Math.max(time, nomination.confirmedTime, nomination.resultTime)
            }, 0) / 1000);
            this.queryAfter = ` after:${latest}`;
        } else {
            this.queryAfter = '';
        }
        const queries: Array<Promise<void>> = [];
        for (const status of umi.status.values()) {
            for (const scanner of status.queries.keys()) {
                queries.push(this.query(status, scanner));
            }
        }
        await Promise.allSettled(queries);
        nominations.push(...this.nominations);
        return;
    }

    /**
     * Start to query message list
     * @param status Status to query
     * @param scanner Scanner to query
     */
    private async query(status: umi.Status, scanner: umi.ScannerCode) {
        this.progress.addList();
        // Query ID list
        const ids: Array<string> = [];
        let pageToken: string | undefined = undefined;
        do {
            type ListResponse = gapi.client.Response<gapi.client.gmail.ListMessagesResponse>;
            const response: ListResponse = await gapi.client.gmail.users.messages.list({
                userId: 'me',
                q: `${status.queries.get(scanner)!}${this.queryAfter}`,
                pageToken: pageToken
            });
            if (!response) break;
            if (response.result.messages) {
                const filtered = response.result.messages.filter(message => {
                    if (!message.id) return false;
                    return !this.ignoreIds.includes(message.id);
                }).map(message => message.id!);
                ids.push(...filtered);
            }
            pageToken = response.result.nextPageToken;
        } while (pageToken);
        this.progress.finishList(ids.length);
        // Query and parse mails
        for (const id of ids) {
            const response = await gapi.client.gmail.users.messages.get({
                userId: 'me',
                id: id,
                format: 'full',
                metadataHeaders: 'Subject'
            });
            if (!response) continue;
            const fullMail = response.result;
            try {
                const nomination = parser.parse(fullMail, status.code, scanner);
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
                this.events.alert(`An error occurs when parsing mail, you may report the mail ${subject}  with this message to developers: [${status}:${scanner}]${details}`);
            }
            this.progress.finishMessage();
        }
        return;
    }
}
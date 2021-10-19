import { delibird } from '@/service/delibird';
import { preferences } from '@/service/preferences';
import { umi } from '@/service/umi';
import { NominationRAW } from '@/service/nomination';
import { ProgressCallback } from '@/service/types';

import { parser } from './parser';

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

    constructor(callback: ProgressCallback) {
        this.onProgress = callback;
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
export namespace mari {

    /**
     * Start the process
     * @param nominations Existing nominations
     */
    export async function start(raws: Array<NominationRAW>, onProgress: ProgressCallback) {
        const progress = new Progress(onProgress);

        // Ignore the mails already in the list
        const ignoreIds = raws.flatMap(nomination => {
            return nomination.resultMailId.length > 0 
                ? [ nomination.confirmationMailId, nomination.resultMailId ] : [ nomination.confirmationMailId ];
        });
        let queryAfter = '';
        if (preferences.general.queryAfterLatest()) {
            const latest = Math.floor(raws.reduce((time, nomination) => {
                return Math.max(time, nomination.confirmedTime, nomination.resultTime)
            }, 0) / 1000);
            queryAfter = ` after:${latest}`;
        }
        const queries: Array<Promise<void>> = [];
        for (const status of umi.status.values()) {
            for (const scanner of status.queries.keys()) {
                queries.push(query(raws, progress, status, scanner, queryAfter, ignoreIds));
            }
        }
        await Promise.allSettled(queries);
        return;
    }

    /**
     * Start to query message list
     * @param raws Nomination list to fill
     * @param progress Progress manager
     * @param status Status to query
     * @param scanner Scanner to query
     */
    async function query(
        raws: Array<NominationRAW>, progress: Progress,
        status: umi.Status, scanner: umi.ScannerCode,
        queryAfter: string,  ignoreIds: Array<string>
    ) {
        progress.addList();
        // Query ID list
        const ids: Array<string> = [];
        let pageToken: string | undefined = undefined;
        do {
            type ListResponse = gapi.client.Response<gapi.client.gmail.ListMessagesResponse>;
            const response: ListResponse = await gapi.client.gmail.users.messages.list({
                userId: 'me',
                q: `${status.queries.get(scanner)!}${queryAfter}`,
                pageToken: pageToken
            });
            if (!response) break;
            if (response.result.messages) {
                const filtered = response.result.messages.filter(message => {
                    if (!message.id) return false;
                    return !ignoreIds.includes(message.id);
                }).map(message => message.id!);
                ids.push(...filtered);
            }
            pageToken = response.result.nextPageToken;
        } while (pageToken);
        progress.finishList(ids.length);
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
                raws.push(parser.parse(fullMail, status.code, scanner));
            } catch (error) {
                let subject = '';
                for (const header of fullMail.payload!.headers!) {
                    if (header.name === 'Subject') {
                        subject = header.value!;
                        break;
                    }
                }
                let details: string = '';
                if (error instanceof Error) {
                    details = error.stack || error.message;
                }
                delibird.alert(`An error occurs when parsing mail, you may report the mail ${subject} with this message to developers: [${status}:${scanner}]${details}`);
            }
            progress.finishMessage();
        }
        return;
    }
}
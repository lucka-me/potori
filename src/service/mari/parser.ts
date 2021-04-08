import { umi } from '@/service/umi';
import Nomination, { LngLat } from '@/service/nomination';

/**
 * Parsers for mail content
 */
export namespace parser {
    /**
     * Parse the full mail to nomination
     * @param mail The full mail to parse
     * @param status Statue of the mail
     * @param scanner Scanner of the mail
     * @returns The parsed nomination
     */
    export function parse(
        mail: gapi.client.gmail.Message,
        status: umi.StatusCode,
        scanner: umi.ScannerCode
    ): Nomination {
        const nomination = new Nomination();
        nomination.status = status;
        nomination.scanner = scanner;
        if (status === umi.StatusCode.Pending) {
            nomination.confirmedTime = parseInt(mail.internalDate!);
            nomination.confirmationMailId = mail.id!;
        } else {
            nomination.resultTime = parseInt(mail.internalDate!);
            nomination.resultMailId = mail.id!;
        }

        // Subject -> Title
        for (const header of mail.payload!.headers!) {
            if (header.name === 'Subject') {
                const matched = header.value!.match(/[:：](.+)/);
                if (matched && matched.length > 1) {
                    nomination.title = matched[1].trim();
                }
                break;
            }
        }

        // Body -> image, id, lngLat and reason
        for (const part of mail.payload!.parts!) {
            if (part.partId !== '1') continue;
            const mailBody = base64(part.body!.data!);
            const matched = mailBody.match(/(?:googleusercontent|ggpht)\.com\/([0-9a-zA-Z\-\_]+)/);
            if (matched && matched.length > 1) {
                nomination.image = matched[1];
                nomination.id = Nomination.parseId(nomination.image);
            }
            if (scanner === umi.ScannerCode.Redacted && status !== umi.StatusCode.Pending) {
                nomination.lngLat = lngLat(mailBody);
            }
            if (status === umi.StatusCode.Rejected) {
                nomination.status = umi.StatusCode.Rejected;
                nomination.reasons = reason(mailBody, scanner);
            }
            break;
        }
        return nomination;
    }

    /**
     * Parse the reject reason from mail body
     * @param mail Body (content) of the mail
     * @param scanner The scanner key for fetch the keywords
     */
    function reason(mail: string, scanner: umi.ScannerCode): Array<umi.ReasonCode> {
        const matchedMainBody = mail.match(/(\n|\r|.)+?\-NianticOps/);
        if (!matchedMainBody || matchedMainBody.length < 1) {
            return [ ];
        }
        const mainBody = matchedMainBody[0];

        const indexReasons: Array<[number, umi.ReasonCode]> = []
        for (const [code, reason] of umi.reason) {
            const keywords = reason.keywords.get(scanner);
            if (!keywords) continue;
            for (const keyword of keywords) {
                const pos = mainBody.search(keyword);
                if (pos < 0) continue;
                indexReasons.push([pos, code]);
                break;
            }
        }
        return indexReasons
            .sort((a, b) => a[0] > b[0] ? 1 : -1)
            .map((pair) => pair[1]);
    }

    /**
     * Parse the location from mail body, only redacted mails contain location
     * @param mail Body (content) of the mail
     */
    function lngLat(mail: string): LngLat | undefined {
        const matched = mail.match(/www\.ingress\.com\/intel\?ll\=([\.\d]+),([\.\d]+)/);
        if (!matched || matched.length < 3) {
            return undefined;
        }
        return {
            lng: parseFloat(matched[2]),
            lat: parseFloat(matched[1])
        };
    }

    /**
     * Decode base64
     * @param text Base64 encoded text
     * @see https://nelluil.postach.io/post/btoa-atob-zhi-yuan-zhong-wen-de-fang-fa
     * @see https://cnodejs.org/topic/4fd6b7ba839e1e581407aac8
     */
    function base64(text: string) {
        return unescape(
            decodeURIComponent(
                escape(window.atob(text.replace(/\-/g, '+').replace(/\_/g, '/')))
            )
        );
    }
}
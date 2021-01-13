import { umi } from 'service/umi';
import Nomination, { LngLat } from 'service/nomination';

/**
 * Query keys
 */
export interface QueryKeys {
    scanner: umi.ScannerCode;    // Scanner key, redacted, prime etc.
    type: string;       // Type key, pending, accepted, rejected
}

/**
 * Parsers for mail content
 */
export default class Parser {
    /**
     * Parse the full mail to nomination
     * @param mail The full mail to parse
     * @param keys Query keys
     * @returns The parsed nomination
     */
    static mail(mail: gapi.client.gmail.Message, keys: QueryKeys): Nomination {
        const nomination = new Nomination();
        nomination.status = umi.types.get(keys.type).code;
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
                const matched = header.value.match(/[:：](.+)/);
                if (matched && matched.length > 1) {
                    nomination.title = matched[1];
                }
                break;
            }
        }

        // Body -> image, id, lngLat and reason
        for (const part of mail.payload.parts) {
            if (part.partId !== '1') continue;
            const mailBody = this.base64(part.body.data);
            const matched = mailBody.match(/googleusercontent\.com\/([0-9a-zA-Z\-\_]+)/);
            if (matched && matched.length > 1) {
                nomination.image = matched[1];
                nomination.id = Nomination.parseId(nomination.image);
            }
            if (keys.scanner === umi.ScannerCode.Redacted && keys.type !== 'pending') {
                nomination.lngLat = this.lngLat(mailBody);
            }
            if (keys.type === 'rejected') {
                nomination.status = this.reason(mailBody, keys.scanner).code;
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
    static reason(mail: string, scanner: umi.ScannerCode) {
        const undeclared = umi.reasons.get('undeclared');
        const matchedMainBody = mail.match(/(\n|\r|.)+?\-NianticOps/);
        if (!matchedMainBody || matchedMainBody.length < 1) {
            return undeclared;
        }
        const mainBody = matchedMainBody[0];
        
        // Get first result
        let result = undeclared;
        let firstPos = mainBody.length;
        for (const reason of umi.reasons.values()) {
            if (!reason.keywords.has(scanner)) continue;
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

    /**
     * Parse the location from mail body, only redacted mails contain location
     * @param mail Body (content) of the mail
     */
    static lngLat(mail: string): LngLat {
        const matched = mail.match(/www\.ingress\.com\/intel\?ll\=([\.\d]+),([\.\d]+)/);
        if (!matched || matched.length < 3) {
            return null;
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
    static base64(text: string) {
        return unescape(
            decodeURIComponent(
                escape(window.atob(text.replace(/\-/g, '+').replace(/\_/g, '/')))
            )
        );
    }
}
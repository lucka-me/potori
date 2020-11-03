import { service } from 'service';
import Nomination, { LngLat } from 'service/nomination';

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
        nomination.status = service.status.types.get(keys.type);
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
            if (part.partId !== '1') continue;
            const mailBody = this.base64(part.body.data);
            const matchedImages = mailBody.match(/googleusercontent\.com\/[0-9a-zA-Z\-\_]+/);
            if (matchedImages) {
                nomination.image = matchedImages[0].replace('googleusercontent.com/', '');
                nomination.id = Nomination.parseId(nomination.image);
            }
            if (keys.scanner === 'redacted' && keys.type !== 'pending') {
                nomination.lngLat = this.lngLat(mailBody);
            }
            if (keys.type === 'rejected') {
                nomination.status = this.reason(mailBody, keys.scanner);
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
    static reason(mail: string, scanner: string) {
        const mainBody = mail.slice(0, mail.search('-NianticOps'));
        const undeclared = service.status.reasons.get('undeclared');
        // Get first result
        let result = undeclared;
        let firstPos = mail.length;
        for (const reason of service.status.reasons.values()) {
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
        let intel = mail.slice(mail.search('https://www.ingress.com/intel'));
        intel = intel.slice(0, intel.search('">'));
        const lngLatPair = intel.slice(intel.search('ll=') + 3, intel.search('&z=18')).split(',');
        return {
            lng: parseFloat(lngLatPair[1]),
            lat: parseFloat(lngLatPair[0])
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
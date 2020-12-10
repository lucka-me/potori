import { eli } from '@lucka-labs/eli';

export namespace eliUtil {
    export function copy(text: string) {
        const textarea = eli('textarea', {
            value: text,
            readOnly: true
        });
        document.body.append(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
    }
}
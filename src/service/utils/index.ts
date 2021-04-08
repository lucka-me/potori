import { eli } from "@lucka-labs/eli";

export namespace util {

    export function copy(text: string) {
        const textarea = eli('textarea', { value: text, readOnly: true });
        document.body.append(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
    }

    export function exportFile(filename: string, blob: Blob) {
        const anchor = eli('a', {
            href: URL.createObjectURL(blob),
            download: filename,
            hidden: true
        });
        document.body.append(anchor);
        anchor.click();
        anchor.remove();
    }

    export async function importFile() {
        const input = eli('input', {
            type: 'file',
            accept: 'json',
            hidden: true
        });
        return new Promise<string>(resolve => {
            input.addEventListener('change', () => {
                setTimeout(() => {
                    input.remove();
                }, 1000);
                if (!input.files || input.files.length < 1) return;
                const file = input.files[0];
                const fileReader = new FileReader();
                fileReader.onload = () => {
                    if (typeof fileReader.result !== 'string') return;
                    resolve(fileReader.result);
                };
                fileReader.readAsText(file);
            }, false);
            document.body.append(input);
            input.click();
        });
    }

    export async function loadScript(url: string) {
        const script = eli('script', { src: url, defer: true });
        return new Promise<void>(resolve => {
            script.onload = () => {
                resolve();
            };
            document.head.append(script);
        });
    }
}
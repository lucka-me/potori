import i18next from 'i18next';

/**
 * Events for {@link @LocalFileKit}
 */
interface LocalFileKitEvents {
    /**
     * Triggered when require the UI to open a file
     * @param opened Callback that should be triggered when file is opened
     */
    openUI: (opened: (file: File) => void) => void;
    /**
     * Triggered when require the UI to save a file
     * @param filename The default filename to save
     * @param href URL of the content
     */
    saveUI: (filename: string, href: string) => void;
}

/**
 * Open and save local files
 */
export default class LocalFileKit {

    events: LocalFileKitEvents = {
        openUI: () => {},
        saveUI: () => {},
    };

    /**
     * Open a local file
     * @param onload Triggered when content is loaded
     * @param onerror Triggered when error occurs
     */
    open(onload: (result: string) => void, onerror: (message: string) => void) {
        this.events.openUI((file: File) => {
            if (!file) {
                onerror(i18next.t('message:service.file.local.openFailed'));
                return;
            }
            const fileReader = new FileReader();
            fileReader.onload = () => {
                onload(fileReader.result as string);
            };
            fileReader.readAsText(file);
        });
    }

    /**
     * Save a local file
     * @param filename Default filename
     * @param blob Content to save
     */
    save(filename: string, blob: Blob) {
        this.events.saveUI(filename, URL.createObjectURL(blob));
    }
}
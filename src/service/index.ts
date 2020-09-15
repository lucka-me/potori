import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import authKit from './auth';
import Mari from './mari';
import BrainstormingKit from './brainstorming';
import FileKit, { Constants as FileConst } from './file';
import Nomination from './nomination';
import translations from '../locales';

class Parser {
    static nominations(content: string) {
        const result = {
            matched: false,
            message: '',
            nominations: [] as Array<Nomination>,
        };
        try {
            const jsonList = JSON.parse(content);
            if (jsonList.length === 0) {
                result.message = i18next.t('message:List is empty');
                return result;
            }
            for (const json of jsonList) {
                const nomination = Nomination.from(json);
                if (!nomination.id) {
                    result.nominations = [];
                    result.message = i18next.t('message:Failed to parse as Nomination List');
                    return result;
                }
                result.nominations.push(Nomination.from(json));
            }
        } catch(error) {
            result.message = i18next.t('message:Failed to parse as Nomination List');
            return result;
        }
        result.matched = true;
        return result;
    }

    static bsData(content: string) {
        const result = {
            matched: false,
            message: '',
            data: null as Map<string, any>,
        };
        try {
            result.data = new Map(JSON.parse(content));
            result.matched = true;
        } catch (error) {
            result.message = i18next.t('message:Failed to parse as Brainstorming Data');
        }

        return result;
    }
}

class BlobGenerator {
    static nominations(nominations: Array<Nomination>) {
        const list = [];
        for (const nomination of nominations) {
            list.push(nomination.json);
        }
        
        return new Blob(
            [ JSON.stringify(list, null, 4) ],
            { type: FileConst.type }
        );
    }

    static bsData(data: Map<string, any>) {
        return new Blob(
            [ JSON.stringify([...data], null, 4) ],
            { type: FileConst.type }
        );
    }
}

interface ServiceEvents {
    authStatusChanged   : (signedIn: boolean) => void,
    progressUpdate      : (percent: number) => void,
    updateBs            : () => void,
    showProgress        : () => void,
    
    show    : () => void,
    clear   : () => void,
    
    alert   : (message: string) => void,
    info    : (message: string) => void,
}

class Service {

    auth    = authKit;
    bs      = new BrainstormingKit();
    file    = new FileKit();
    mari    = new Mari();

    nominations: Array<Nomination> = [];

    events: ServiceEvents = {
        authStatusChanged:  (signedIn) => signedIn,
        progressUpdate:     (percent) => percent,
        updateBs:           () => {},
        showProgress:       () => {},
        
        show:   () => {},
        clear:  () => {},
        
        alert:  (message) => message,
        info:   (message) => message,
    };

    init() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js');
            });
        }

        i18next
            .use(LanguageDetector)
            .init({
                fallbackLng: 'en-US',
                keySeparator: false,
                resources: translations,
                ns: ['general', 'message'],
                defaultNS: 'general',
            });

        this.auth.events.authStatusChanged = (signedIn) => {
            if (!signedIn) {
                this.nominations = [];
            }
            this.events.authStatusChanged(signedIn);
            if (signedIn) {
                this.startMail();
            }
        };
        this.auth.events.error = (error) => {
            this.events.alert(JSON.stringify(error, null, 2));
        }

        this.auth.init();

        this.mari.events.finish = () => this.finish();
    }

    startMail() {
        this.events.clear();
        this.events.showProgress();
        this.download(() => {
            this.mari.start(this.nominations);
        });
    }

    finish() {
        this.events.showProgress();
        // Merge duplicated nominations -> targets
        for (let i = this.nominations.length - 1; i >= 0; i--) {
            const current = this.nominations[i];

            for (let j = 0; j < i; j++) {
                if (current.id !== this.nominations[j].id) continue;
                const target = this.nominations[j];
                if (target.resultMailId) {
                    target.confirmedTime = current.confirmedTime;
                    target.confirmationMailId = current.confirmationMailId;
                    if (!target.lngLat) target.lngLat = current.lngLat;
                } else {
                    target.status = current.status;
                    target.lngLat = current.lngLat;
                    target.resultTime = current.resultTime;
                    target.resultMailId = current.resultMailId;
                }
                this.nominations.splice(i, 1);
                break;
            }
        }

        // Sort by time
        this.nominations.sort((a, b) => {
            const timeA = a.resultTime ? a.resultTime : a.confirmedTime;
            const timeB = b.resultTime ? b.resultTime : b.confirmedTime;
            return timeA < timeB ? 1 : -1;
        });

        const finished = () => {
            this.events.show();
        };

        // Query locations
        const listNoLocation: Array<Nomination> = this.nominations.reduce((list, nomination) => {
            if (!nomination.lngLat) list.push(nomination);
            return list;
        }, []);
        if (listNoLocation.length < 1) {
            finished();
            return;
        }
        let count = 0;
        this.events.progressUpdate(0.9);
        const countUp = () => {
            count += 1;
            this.events.progressUpdate(0.9 + (count / listNoLocation.length * 0.1));
            if (count === listNoLocation.length) finished();
        };
        for (const nomination of listNoLocation) {
            this.bs.queryLngLat(
                nomination.id,
                (lngLat) => {
                    nomination.lngLat = lngLat;
                    countUp();
                },
                countUp
            );
        }
    }

    open() {
        this.events.clear();
        const onload = (content: string) => {
            const resultNominations = Parser.nominations(content);
            if (resultNominations.matched) {
                this.nominations = [];
                this.nominations.push(...resultNominations.nominations);
                this.finish();
                return;
            }
            const resultBsData = Parser.bsData(content);
            if (resultBsData.matched) {
                this.bs.data = resultBsData.data;
                if (this.nominations.length > 0) {
                    this.events.updateBs();
                }
                this.events.info(i18next.t('message:Load as Brainstorming Data'));
                return;
            }
            // Parse as other contents
        };
        this.file.local.open(onload, this.events.alert);
    }

    save() {
        if (this.nominations.length < 1) {
            this.events.alert(i18next.t('message:No Nomination to save'));
            return;
        }
        this.file.local.save(FileConst.nominations, BlobGenerator.nominations(this.nominations));
        window.setTimeout(() => {
            this.file.local.save(FileConst.bsData, BlobGenerator.bsData(this.bs.data));
        }, 2000);
    }

    download(finished: () => void) {
        let finishedNominations = false;
        let finishedBsData = false;

        const checkFinish = () => {
            if (finishedNominations && finishedBsData) finished();
        };

        const gotNominations = (file: gapi.client.drive.File, more: boolean) => {
            if (!file) {
                finishedNominations = true;
                checkFinish();
                return true;
            }
            try {
                const jsonList = file as Array<any>;
                this.nominations = jsonList.map(json => Nomination.from(json));
            } catch (error) {
                if (more) return false;
                finishedNominations = true;
                checkFinish();
                return true;
            }

            finishedNominations = true;
            checkFinish();
            return true;
        };
        const gotBsData = (result: gapi.client.drive.File, more: boolean) => {
            if (!result) {
                finishedBsData = true;
                checkFinish();
                return true;
            }

            try {
                this.bs.data = new Map(result as Array<[string, any]>);
            } catch (error) {
                if (more) return false;
                finishedBsData = true;
                checkFinish();
                return true;
            }

            finishedBsData = true;
            checkFinish();
            return true;
        };
        this.file.googleDrive.download(FileConst.bsData, gotBsData);
        this.file.googleDrive.download(FileConst.nominations, gotNominations);
    }

    upload() {

        let uploadedNominations = false;
        let uploadedBsData = false;

        const checkFinish = () => {
            if (uploadedNominations && uploadedBsData) {
                this.events.info(i18next.t('message:Uploaded'));
            };
        };

        this.file.googleDrive.upload(
            FileConst.nominations,
            BlobGenerator.nominations(this.nominations),
            this.auth.accessToken,
            (succeed, message?) => {
                uploadedNominations = true;
                if (!succeed) {
                    this.events.alert(`${i18next.t('message:Unable to upload Nomination List')}${message ? `\n${message}` : ''}`);
                }
                checkFinish();
            }
        );

        this.file.googleDrive.upload(
            FileConst.bsData,
            BlobGenerator.bsData(this.bs.data),
            this.auth.accessToken,
            (succeed, message?) => {
                uploadedBsData = true;
                if (!succeed) {
                    this.events.alert(`${i18next.t('message:Unable to upload Brainstorming Data')}${message ? `\n${message}` : ''}`);
                }
                checkFinish();
            }
        );

    }

    import(raw: string) {
        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch (error) {
            this.events.alert(i18next.t('message:Unable to parse the code'));
            return;
        }
        if (!parsed.result || parsed.result.length < 1) {
            this.events.alert(i18next.t('message:Invalid data'));
        }
        const mapNomination = new Map();
        for (const monination of this.nominations) {
            mapNomination.set(monination.id, monination);
        }
        for (const nomination of parsed.result) {
            const imageUrl = nomination.imageUrl.replace('https://lh3.googleusercontent.com/', '');
            const id = Nomination.parseId(imageUrl);
            if (!mapNomination.has(id)) continue;

            const monination = mapNomination.get(id);
            monination.title = nomination.title;
            monination.lngLat = {
                lng: parseFloat(nomination.lng),
                lat: parseFloat(nomination.lat)
            };
        }
        this.events.show();
    }

    updateBsData() {
        this.bs.update(this.nominations, () => {
            this.events.updateBs();
            this.events.info(i18next.t('message:Brainstorming Data updated'));
        });
    }

    clearBsData() {
        this.bs.clear();
    }
}

export default new Service();
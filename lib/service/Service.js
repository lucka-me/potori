import { AuthKit } from "./AuthKit.js";
import { Mari } from "./Mari.js";
import { BrainstormingKit } from "./BrainstormingKit.js";
import { FileKit } from "./FileKit.js";
import AlertDialog from "../ui/dialog/AlertDialog.js";

class Parser {
    static portals(content) {
        const result = { matched: false, message: '', portals: [] };
        try {
            result.portals = JSON.parse(content);
            if (result.portals.length === 0) {
                result.message = value.string.alert.openFileEmpty;
                return result;
            }
        } catch(error) {
            result.message = value.string.alert.openFileParseError;
            return result;
        }
        if (!Checker.portals(result.portals)) {
            result.message = value.string.alert.openFileStructError;
            return result;
        }
        result.matched = true;
        result.portals = list;
        return result;
    }

    static bsData(content) {
        const result = { matched: false, message: '', data };
        try {
            result.data = new Map(JSON.parse(content));
            result.matched = true;
        } catch (error) {
            result.message = value.string.alert.openFileParseError;
        }

        return result;
    }
}

class Checker {
    static portals(content) {
        if (content.length === undefined) return false;
        for (const portal of content) {
            if (portal.id === undefined
                || portal.title === undefined
                || portal.image === undefined
                || portal.status === undefined
                || portal.confirmedTime === undefined
                || portal.confirmationMailId === undefined
            ) return false;
        }
        return true;
    }

    static bsData(content) {
        // TODO
        content;
        return true;
    }
}

class BlobGenerator {
    static portals(portals) {
        const list = [];
        for (const portal of portals) {
            const decyclic = {};
            for (const key of Object.keys(portal)) {
                if (key !== 'marker') decyclic[key] = portal[key];
            }
            list.push(decyclic);
        }
        return new Blob(
            [JSON.stringify(list, null, 4)],
            { type: value.string.file.type }
        );
    }

    static bsData(data) {
        return new Blob(
            [JSON.stringify([...data], null, 4)],
            { type: value.string.file.type }
        );
    }
}

class Service {
    constructor() {
        this.auth   = new AuthKit();
        this.bs     = new BrainstormingKit();
        this.file   = new FileKit();
        this.mari   = new Mari();

        this.portals    = [];
    }

    init() {
        this.auth.authStatusChanged = (signedIn) => {
            ui.authStatusChanged(signedIn);
            if (signedIn) {
                this.startMail();
            } else {
                this.portals = [];
            }
        };
        this.auth.onerror = (error) => {
            AlertDialog.open(JSON.stringify(error, null, 2));
        }

        this.bs.init();

        this.mari.bufferUpdate = (percent) => {
            ui.progress.ctrl.buffer = percent;
        };
        this.mari.progressUpdate = (percent) => {
            ui.progress.ctrl.progress = percent * 0.9;
        }
    }

    startMail() {
        ui.clear();
        ui.appBar.menu.item.openFile.hidden = true;
        ui.appBar.menu.item.saveFile.hidden = true;
        ui.progress.ctrl.root_.hidden = false;
        this.download(() => {
            this.mari.start(this.portals, () => this.finish());
        });
    }

    finish() {
        ui.progress.ctrl.root_.hidden = false;
        // Merge duplicated portals -> targetPortals
        for (let i = this.portals.length - 1; i >= 0; i--) {
            const portal = this.portals[i];

            for (let j = 0; j < i; j++) {
                if (portal.id !== this.portals[j].id) continue;
                const targetPortal = this.portals[j];
                if (targetPortal.resultMailId) {
                    targetPortal.confirmedTime = portal.confirmedTime;
                    targetPortal.confirmationMailId = portal.confirmationMailId;
                    if (!targetPortal.lngLat) targetPortal.lngLat = portal.lngLat;
                } else {
                    targetPortal.status = portal.status;
                    targetPortal.lngLat = portal.lngLat;
                    targetPortal.resultTime = portal.resultTime;
                    targetPortal.resultMailId = portal.resultMailId;
                }
                this.portals.splice(i, 1);
                break;
            }
        }

        // Sort by time
        this.portals.sort((a, b) => {
            const timeA = a.resultTime ? a.resultTime : a.confirmedTime;
            const timeB = b.resultTime ? b.resultTime : b.confirmedTime;
            return timeA < timeB ? 1 : -1;
        });

        const finished = () => {
            ui.show();
        };

        // Query locations
        const listNoLocation = [];
        for (const portal of this.portals) {
            if (!portal.lngLat) {
                listNoLocation.push(portal);
            }
        }

        if (listNoLocation.length < 1) {
            finished();
            return;
        }
        let count = 0;
        ui.progress.ctrl.progress = 0.9;
        const countUp = () => {
            count += 1;
            ui.progress.ctrl.progress = 0.9 + (count / listNoLocation.length * 0.1);
            if (count === listNoLocation.length) finished();
        };
        for (const portal of listNoLocation) {
            this.bs.queryLngLat(
                portal.id,
                (lngLat) => {
                    portal.lngLat = lngLat;
                    countUp();
                },
                countUp
            );
        }
    }

    open() {
        ui.clear();
        const onload = (content) => {
            const resultPortals = Parser.portals(content);
            if (resultPortals.matched) {
                this.portals = [];
                this.portals.push(...resultPortals.portals);
                ui.appBar.menu.item.openFile.hidden = true;
                console.log('open finish');
                this.finish();
                return;
            }
            const resultBsData = Parser.bsData(content);
            if (resultBsData.matched) {
                this.bs.data = resultBsData.data;
                if (this.portals.length > 0) {
                    ui.dashboard.bs.update();
                }
                return;
            }
            // Parse as other contents
        };
        this.file.local.open(onload, (message) => {
            AlertDialog.open(message);
        });
    }

    save() {
        if (this.portals.length < 1) {
            AlertDialog.open(value.string.alert.saveFileNoPortal);
            return;
        }
        this.file.local.save(value.string.file.portals, BlobGenerator.portals(this.portals));
        window.setTimeout(() => {
            this.file.local.save(value.string.file.bsData, BlobGenerator.bsData(this.bs.data));
        }, 2000);
    }

    download(finished) {
        let gotPortals = false;
        let gotBsData = false;

        const checkFinish = () => {
            if (gotPortals && gotBsData) finished();
        };

        const onGetPortals = (result, more) => {
            if (!result) {
                gotPortals = true;
                checkFinish();
                return true;
            }
            if (!Checker.portals(result)) {
                if (more) return false;
                gotPortals = true;
                checkFinish();
                return true;
            }
            this.portals = [];
            this.portals.push(...result);
            gotPortals = true;
            checkFinish();
            return true;
        };
        const onGetBsData = (result, more) => {
            if (!result) {
                gotBsData = true;
                checkFinish();
                return true;
            }

            try {
                this.bs.data = new Map(result);
            } catch (error) {
                if (more) return false;
                gotBsData = true;
                checkFinish();
                return true;
            }

            gotBsData = true;
            checkFinish();
            return true;
        };
        this.file.googleDrive.get(value.string.file.bsData, onGetBsData);
        this.file.googleDrive.get(value.string.file.portals, onGetPortals);
    }

    upload() {

        let uploadedPortals = false;
        let uploadedBsData = false;

        const checkFinish = () => {
            if (uploadedPortals && uploadedBsData) {
                AlertDialog.open(value.string.alert.uploaded);
            };
        };

        this.file.googleDrive.uploaded(
            value.string.file.portals,
            BlobGenerator.portals(),
            (response) => {
                uploadedPortals = true;
                if (!response) {
                    AlertDialog.open(value.string.alert.uploadFailed);
                } else if (!response.id) {
                    AlertDialog.open(`${value.string.alert.uploadFailed}\n${response.message}`);
                    return;
                }
                checkFinish();
            }
        );

        this.file.googleDrive.uploaded(
            value.string.file.bsData,
            BlobGenerator.bsData(),
            (response) => {
                uploadedBsData = true;
                if (!response) {
                    AlertDialog.open(value.string.alert.uploadFailed);
                } else if (!response.id) {
                    AlertDialog.open(`${value.string.alert.uploadFailed}\n${response.message}`);
                    return;
                }
                checkFinish();
            }
        );

    }

    import(raw) {
        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch (error) {
            AlertDialog.open(value.string.alert.invalidData);
            return;
        }
        if (!parsed.result || parsed.result.length < 1) {
            AlertDialog.open(value.string.alert.invalidData);
        }
        const mapPortal = new Map();
        for (const portal of this.portals) {
            mapPortal.set(portal.id, portal);
        }
        for (const nomination of parsed.result) {
            const imageUrl = nomination.imageUrl.replace('https://lh3.googleusercontent.com/', '');
            const id = this.bs.getId(imageUrl);
            if (!mapPortal.has(id)) continue;

            const portal = mapPortal.get(id);
            portal.title = nomination.title;
            portal.lngLat = {
                lng: parseFloat(nomination.lng),
                lat: parseFloat(nomination.lat)
            };
        }
        ui.show();
    }

    updateBsData() {
        this.bs.update(this.portals, () => {
            ui.dashboard.bs.update();
            AlertDialog.open(value.string.alert.updated);
        });
    }
}

export { Service };
import { Mari } from "./Mari.js";
import { BrainstormingKit } from "./BrainstormingKit.js";
import { FileKit } from "./FileKit.js";

window.process = {

    mari: new Mari(),
    bs: new BrainstormingKit(),
    file: new FileKit(),
    portals: [],

    init() {
        this.bs.init();
    },

    startMail() {
        this.mari.start();
    },

    finish() {
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

        const onFinished = () => {
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
            onFinished();
            return;
        }
        let count = 0;
        ui.progress.ctrl.progress = 0.9;
        const countUp = () => {
            count += 1;
            ui.progress.ctrl.progress = 0.9 + (count / listNoLocation.length * 0.1);
            if (count === listNoLocation.length) onFinished();
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
    },

    analyseBs() {
        const stats = {
            review: 0, portal: 0,
            rate: { },
            reviewTimes: [],
            synch: { total: 0, synched: 0 },
        };
        const rateKeys = Object.keys(value.string.bs.rate);
        for (const key of rateKeys) {
            stats.rate[key] = [];
        }
        const statsRate = (rateJson, key) => {
            if (rateJson[key]) {
                stats.rate[key].push(parseInt(rateJson[key]));
            }
        }
        for (const portal of this.portals) {
            if (!this.bs.data.has(portal.id)) continue;
            const bs = this.bs.data.get(portal.id);
            const generals = [];
            for (const key of Object.keys(bs)) {
                if (!key.startsWith('review')) continue;
                const review = bs[key];
                if (!review.stars) continue;
                stats.review += 1;
                generals.push(review.stars);
                const rateJson = review.JSON;
                for (const rateKey of rateKeys) {
                    statsRate(rateJson, rateKey);
                }
                stats.reviewTimes.push(review.Timestamp);
                if (portal.status === value.data.type.pending.code) continue;
                // Synch
                stats.synch.total += 1;
                if (BrainstormingKit.isSynched(review.stars, portal.status)) {
                    stats.synch.synched += 1;
                }
            }
            if (generals.length < 1) continue;
            stats.portal += 1;
        }
        return stats;
    },

    open() {
        ui.clear();
        const onload = (content) => {
            const resultPortals = this.parse.portals(content);
            if (resultPortals.matched) {
                ui.appBar.menu.item.openFile.hidden = true;
                ui.appBar.menu.item.saveFile.hidden = false;
                this.finish();
                return;
            }
            const resultBsData = this.parse.bsData(content);
            if (resultBsData.matched) {
                if (this.portals.length > 0) {
                    ui.dashboard.bs.update();
                }
                return;
            }
            // Parse as other contents
        };
        this.file.local.open(onload);
    },

    save() {
        if (this.portals.length < 1) {
            ui.dialog.alert.open(value.string.alert.saveFileNoPortal);
            return;
        }
        this.file.local.save(value.string.file.portals, this.blob.portals());
        window.setTimeout(() => {
            this.file.local.save(value.string.file.bsData, this.blob.bsData());
        }, 2000);
    },

    download(onFinished) {
        let gotPortals = false;
        let gotBsData = false;

        const checkFinish = () => {
            if (gotPortals && gotBsData) onFinished();
        };

        const onGetPortals = (result, more) => {
            if (!result) {
                gotPortals = true;
                checkFinish();
                return true;
            }
            if (!this.check.portals(result)) {
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
    },

    upload() {

        let uploadedPortals = false;
        let uploadedBsData = false;

        const checkFinish = () => {
            if (uploadedPortals && uploadedBsData) {
                ui.dialog.alert.open(value.string.alert.uploaded);
            };
        };

        this.file.googleDrive.uploaded(
            value.string.file.portals,
            this.blob.portals(),
            (response) => {
                uploadedPortals = true;
                if (!response) {
                    ui.dialog.alert.open(value.string.alert.uploadFailed);
                } else if (!response.id) {
                    ui.dialog.alert.open(`${value.string.alert.uploadFailed}\n${response.message}`);
                    return;
                }
                checkFinish();
            }
        );

        this.file.googleDrive.uploaded(
            value.string.file.bsData,
            this.blob.bsData(),
            (response) => {
                uploadedBsData = true;
                if (!response) {
                    ui.dialog.alert.open(value.string.alert.uploadFailed);
                } else if (!response.id) {
                    ui.dialog.alert.open(`${value.string.alert.uploadFailed}\n${response.message}`);
                    return;
                }
                checkFinish();
            }
        );

    },

    parse: {
        portals: (content) => {
            let list = [];
            const result = { matched: false, message: '' };
            try {
                list = JSON.parse(content);
                if (list.length === 0) {
                    result.message = value.string.alert.openFileEmpty;
                    return result;
                }
            } catch(error) {
                result.message = value.string.alert.openFileParseError;
                return result;
            }
            if (!process.check.portals(list)) {
                result.message = value.string.alert.openFileStructError;
                return result;
            }
            process.portals = [];
            process.portals.push(...list);
            result.matched = true;
            return result;
        },
        bsData: (content) => {
            const result = { matched: false, message: '' };
            try {
                process.bs.data = new Map(JSON.parse(content));
                result.matched = true;
            } catch (error) {
                result.message = value.string.alert.openFileParseError;
            }

            return result;
        }
    },
    check: {
        portals: (content) => {
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
        },
        bsData: (content) => {
            return true;
        }
    },
    blob: {
        portals: () => {
            const list = [];
            for (const portal of process.portals) {
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
        },
        bsData: () => {
            return new Blob(
                [JSON.stringify([...process.bs.data], null, 4)],
                { type: value.string.file.type }
            );
        }
    },

    import(raw) {
        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch (error) {
            ui.dialog.alert.open(value.string.alert.invalidData);
            return;
        }
        if (!parsed.result || parsed.result.length < 1) {
            ui.dialog.alert.open(value.string.alert.invalidData);
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
    },

    updateBsData() {
        this.bs.update(() => {
            ui.dashboard.bs.update();
            ui.dialog.alert.open(value.string.alert.updated);
        });
    },
};
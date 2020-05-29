const process = {

    portals: [],

    finish: () => {
        // Merge duplicated portals -> targetPortals
        for (let i = process.portals.length - 1; i >= 0; i--) {
            const portal = process.portals[i];

            for (let j = 0; j < i; j++) {
                if (portal.id !== process.portals[j].id) continue;
                const targetPortal = process.portals[j];
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
                process.portals.splice(i, 1);
                break;
            }
        }

        // Sort by time
        process.portals.sort((a, b) => {
            const timeA = a.resultTime ? a.resultTime : a.confirmedTime;
            const timeB = b.resultTime ? b.resultTime : b.confirmedTime;
            return timeA < timeB ? 1 : -1;
        });

        const onFinished = () => {
            ui.display();
        };

        // Query locations
        const listNoLocation = [];
        for (const portal of process.portals) {
            if (!portal.lngLat) {
                listNoLocation.push(portal);
            }
        }

        if (listNoLocation.length < 1) {
            onFinished();
            return;
        }
        let count = 0;
        ui.progressBar.progress = 0.9;
        const countUp = () => {
            count += 1;
            ui.progressBar.progress = 0.9 + (count / listNoLocation.length * 0.1);
            if (count === listNoLocation.length) onFinished();
        };
        for (const portal of listNoLocation) {
            bsKit.queryLngLat(
                portal.id,
                (lngLat) => {
                    portal.lngLat = lngLat;
                    countUp();
                },
                countUp
            );
        }
    },

    analyseBs: () => {
        const stats = {
            review: 0, portal: 0,
            rate: { },
            reviewTimes: [],
            synched: 0,
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
        for (const portal of process.portals) {
            if (!bsKit.data.has(portal.id)) continue;
            const bs = bsKit.data.get(portal.id);
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
                // Synch
                if (bsKit.isSynched(review.stars, portal.status)) {
                    stats.synched += 1;
                }
            }
            if (generals.length < 1) continue;
            stats.portal += 1;
        }
        return stats;
    },

    open: () => {
        ui.clear();
        const onLoad = (content) => {
            const resultPortals = process.parse.portals(content);
            if (resultPortals.matched) {
                ui.appBar.menu.item.openFile.hidden = true;
                ui.appBar.menu.item.saveFile.hidden = false;
                process.finish();
                return;
            }
            const resultBsData = process.parse.bsData(content);
            if (resultBsData.matched) {
                if (process.portals.length > 0) {
                    dashboard.card.bs.update();
                }
                return;
            }
            // Parse as other contents
        };
        fileKit.local.open(onLoad);
    },

    save: () => {
        if (process.portals.length < 1) {
            dialogKit.alert.show(value.string.alert.saveFileNoPortal);
            return;
        }
        fileKit.local.save(value.string.file.portals, process.blob.portals());
        fileKit.local.save(value.string.file.bsData, process.blob.bsData());
    },

    download: (onFinished) => {
        let gotPortals = false;
        let gotBsData = false;

        const checkFinish = () => {
            if (gotPortals && gotBsData) onFinished();
        };

        const onGetPortals = (fileId, result, more) => {
            if (!result) {
                gotPortals = true;
                checkFinish();
                return true;
            }
            if (!process.check.portals(result)) {
                if (more) return false;
                gotPortals = true;
                checkFinish();
                return true;
            }
            process.portals = [];
            process.portals.push(...result);
            fileKit.googleDrive.fileId.portals = fileId;
            gotPortals = true;
            checkFinish();
            return true;
        };
        const onGetBsData = (fileId, result, more) => {
            if (!result) {
                gotBsData = true;
                checkFinish();
                return true;
            }

            try {
                bsKit.data = new Map(result);
            } catch (error) {
                if (more) return false;
                gotBsData = true;
                checkFinish();
                return true;
            }

            fileKit.googleDrive.fileId.bsData = fileId;
            gotBsData = true;
            checkFinish();
            return true;
        };
        fileKit.googleDrive.get(value.string.file.bsData, onGetBsData);
        fileKit.googleDrive.get(value.string.file.portals, onGetPortals);
    },

    upload: () => {

        let uploadedPortals = false;
        let uploadedBsData = false;

        const checkFinish = () => {
            if (uploadedPortals && uploadedBsData) {
                dialogKit.alert.show(value.string.alert.uploaded);
            };
        };

        fileKit.googleDrive.uploaded(
            value.string.file.portals,
            fileKit.googleDrive.fileId.portals,
            process.blob.portals(),
            (response) => {
                uploadedPortals = true;
                if (!response) {
                    dialogKit.alert.show(value.string.alert.uploadFailed);
                } else if (!response.id) {
                    dialogKit.alert.show(`${value.string.alert.uploadFailed}\n${response.message}`);
                    return;
                } else {
                    fileKit.googleDrive.fileId.portals = response.id;
                }
                checkFinish();
            }
        );

        fileKit.googleDrive.uploaded(
            value.string.file.bsData,
            fileKit.googleDrive.fileId.bsData,
            process.blob.bsData(),
            (response) => {
                uploadedBsData = true;
                if (!response) {
                    dialogKit.alert.show(value.string.alert.uploadFailed);
                } else if (!response.id) {
                    dialogKit.alert.show(`${value.string.alert.uploadFailed}\n${response.message}`);
                    return;
                } else {
                    fileKit.googleDrive.fileId.bsData = response.id;
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
                bsKit.data = new Map(JSON.parse(content));
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
                [JSON.stringify([...bsKit.data], null, 4)],
                { type: value.string.file.type }
            );
        }
    },

    import: (raw) => {
        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch (error) {
            dialogKit.alert.show(value.string.alert.invalidData);
            return;
        }
        if (!parsed.result || parsed.result.length < 1) {
            dialogKit.alert.show(value.string.alert.invalidData);
        }
        const mapPortal = new Map();
        for (const portal of process.portals) {
            mapPortal.set(portal.id, portal);
        }
        for (const nomination of parsed.result) {
            const imageUrl = nomination.imageUrl.replace('https://lh3.googleusercontent.com/', '');
            const id = bsKit.getId(imageUrl);
            if (!mapPortal.has(id)) continue;

            const portal = mapPortal.get(id);
            portal.title = nomination.title;
            portal.lngLat = {
                lng: parseFloat(nomination.lng),
                lat: parseFloat(nomination.lat)
            };
        }
        ui.display();
    },

    updateBsData: () => {
        bsKit.update(() => {
            dashboard.card.bs.update();
            dialogKit.alert.show(value.string.alert.updated);
        });
    },
};
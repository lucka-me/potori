const toolkit = {
    // Decode Base64
    // Ref: https://nelluil.postach.io/post/btoa-atob-zhi-yuan-zhong-wen-de-fang-fa
    // Ref: https://cnodejs.org/topic/4fd6b7ba839e1e581407aac8
    decodeBase64: (text) => unescape(decodeURIComponent(escape(window.atob(text.replace(/\-/g, "+").replace(/\_/g, "/"))))),
    getBsId: (imgUrl) => imgUrl.replace(/[^a-zA-Z0-9]/g, "").slice(- 10).toLowerCase(),
    lngLatToIntel: (lngLat) => `${value.string.path.intel}?ll=${lngLat.lat},${lngLat.lng}&z=18`,
    getDateString:          (time) => new Date(time).toLocaleDateString(),
    getDateTimeString:      (time) => new Date(time).toLocaleString(),
    getDateTimeISOString:   (time) => new Date(time).toISOString(),
    getLocalDateTimeISOString: (time) => {
        const date = new Date();
        date.setTime(time - date.getTimezoneOffset() * 60000);
        return date.toISOString();
    },
    getLocalTimezoneOffset: () => new Date().getTimezoneOffset() * 60000,
    getIntervalString: (start, end) => {
        const day = Math.floor((end - start) / (24 * 3600 * 1000));
        return `${day} day${(day > 1 ? "s" : "")}`;
    },
    getCountString: (list, ofList) => `${list.length} (${ofList.length > 0 ? (list.length / ofList.length * 100).toFixed(1) : 0}%)`,
    matchData: (code) => {
        let data = value.data.type.pending;
        if (code < 100) {
            if (code === 1) data = value.data.type.accepted;
        } else {
            for (const key of Object.keys(value.data.rejectedReason)) {
                if (value.data.rejectedReason[key].code === code) {
                    data = value.data.rejectedReason[key];
                    break;
                }
            }
        }
        return data;
    },
    getTypeByCode: (code) => {
        if (code === 0) return 'pending';
        if (code === 1) return 'accepted';
        return 'rejected';
    },
    getRejectedReasonByCode: (code) => {
        if (code < 100) return null;
        for (const key of Object.keys(value.data.rejectedReason)) {
            if (value.data.rejectedReason[key].code === code) {
                return key;
            }
        }
        return null;
    },
    parseWayfarerStatus: (status) => {
        switch (status) {
            case 'ACCEPTED':
                return value.data.type.accepted.code;
            case 'DUPLICATE':
                return value.data.rejectedReason.duplicated.code;
            case 'REJECTED':
                return value.data.rejectedReason.undeclared.code;
            case 'VOTING':
            case 'NOMINATED':
            default:
                return value.data.type.pending;
        }
    }
};
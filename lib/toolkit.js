class Toolkit {
    static lngLatToIntel(lngLat) {
        return `${value.string.path.intel}?ll=${lngLat.lat},${lngLat.lng}&z=18`;
    }
    static getDateString(time) {
        return new Date(time).toLocaleDateString();
    }
    static getDateTimeString(time) {
        return new Date(time).toLocaleString();
    }
    static getDateTimeISOString(time) {
        return new Date(time).toISOString()
    }
    static getLocalDateTimeISOString(time) {
        const date = new Date();
        date.setTime(time - date.getTimezoneOffset() * 60000);
        return date.toISOString();
    }
    static getLocalTimezoneOffset() {
        return new Date().getTimezoneOffset() * 60000;
    }
    static getIntervalString(start, end) {
        const day = Math.floor((end - start) / (24 * 3600 * 1000));
        return `${day} day${(day > 1 ? "s" : "")}`;
    }
    static getCountString(count, base) {
        return `${count} (${base > 0 ? (count / base * 100).toFixed(1) : 0}%)`;
    }
    static matchData(code) {
        let data = value.data.type.pending;
        if (code < 100) {
            if (code === 1) data = value.data.type.accepted;
        } else {
            for (const key of Object.keys(value.data.reason)) {
                if (value.data.reason[key].code === code) {
                    data = value.data.reason[key];
                    break;
                }
            }
        }
        return data;
    }
    static typeMatched(status, type) {
        if (type < 101) {
            return status === type;
        } else {
            return status > 100;
        }
    }
    static getTypeByCode(code) {
        if (code === 0) return 'pending';
        if (code === 1) return 'accepted';
        return 'rejected';
    }
    static getReasonByCode(code) {
        if (code < 100) return null;
        for (const key of Object.keys(value.data.reason)) {
            if (value.data.reason[key].code === code) {
                return key;
            }
        }
        return null;
    }
    static parseWayfarerStatus(status) {
        switch (status) {
            case 'ACCEPTED':
                return value.data.type.accepted.code;
            case 'DUPLICATE':
                return value.data.reason.duplicated.code;
            case 'REJECTED':
                return value.data.reason.undeclared.code;
            case 'VOTING':
            case 'NOMINATED':
            default:
                return value.data.type.pending;
        }
    }
    static fillTimeDataMap(dataMap, min, max) {
        let scan = min;
        while (scan <= max) {
            const month = moment(scan + 1000).startOf('month');
            const key = month.valueOf();
            if (!dataMap.has(key)) dataMap.set(key, 0);
            scan = month.endOf('month').valueOf();
        }
    }
    static tooltipsLabelCallback(item, data) {
        const dataset = data.datasets[item.datasetIndex];
        const metadata = dataset._meta[Object.keys(dataset._meta)[0]].data;
        const total = dataset.data.reduce((acc, cur, index) => {
            return acc + (metadata[index].hidden ? 0 : cur);
        }, 0);
        const value = dataset.data[item.index];
        const percentage = ((value / total) * 100).toFixed(2);
        return `${data.labels[item.index]}: ${value} (${percentage}%)`;
    }
    static copyText(text) {
        const textarea = Eli.build('textarea', { value: text, readOnly: true });
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

export { Toolkit }
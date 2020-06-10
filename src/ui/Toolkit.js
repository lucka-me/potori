import moment from 'moment';

class Toolkit {
    static getDateString(time) {
        return new Date(time).toLocaleDateString();
    }
    static getLocalDateTimeISOString(time) {
        const date = new Date();
        date.setTime(time - date.getTimezoneOffset() * 60000);
        return date.toISOString();
    }
    static getIntervalString(start, end) {
        const day = Math.floor((end - start) / (24 * 3600 * 1000));
        return `${day} day${(day > 1 ? "s" : "")}`;
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
}

export default Toolkit;
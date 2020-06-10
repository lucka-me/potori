import moment from 'moment';

class Toolkit {
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
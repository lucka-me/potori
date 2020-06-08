import data from "../data/status.json";

class Status {
    constructor(code = 0, title = '', icon = '') {
        this.code = code;
        this.title = title;
        this.icon = icon;
    }
}

class MailQuery {
    constructor(redacted = '', prime = '') {
        this.redacted = redacted;
        this.prime = prime;
    }
}

class StatusType extends Status {
    constructor(code = 0, title = '', icon = '', query = new MailQuery()) {
        super(code, title, icon);
        this.query = query;
    }
}

class ReasonKeyword {
    constructor(redacted = [''], prime = ['']) {
        this.redacted = redacted;
        this.prime = prime;
    }
}

class StatusReason extends Status {
    constructor(code = 0, title = '', icon = '', color = '', keyword = new ReasonKeyword()) {
        super(code, title, icon);
        this.color = color;
        this.keyword = keyword;
    }
}

class StatusKit {
    constructor() {
        this.version = data.version;
        this.types = new Map([['none', new StatusType()]]);
        this.types.clear();
        for (const type of data.types) {
            this.types.set(type.key, new StatusType(
                type.code, type.title, type.icon,
                new MailQuery(type.query.redacted, type.query.prime)
            ));
        }
        this.reasons = new Map([['none', new StatusReason()]]);
        this.reasons.clear();
        for (const reason of data.reasons) {
            this.reasons.set(reason.key, new StatusReason(
                reason.code, reason.title, reason.icon, reason.color,
                new ReasonKeyword(reason.keyword.redacted, reason.keyword.prime)
            ));
        }
    }

    matchStatus(code) {
        let result = new Status();
        result = this.types.get('pending');
        if (code < 100) {
            if (code === 1) result = this.types.get('accepted');
        } else {
            for (const reason of this.reasons.values()) {
                if (reason.code === code) {
                    result = reason;
                    break; 
                }
            }
        }
        return result;
    }

    typeMatched(status, type) {
        if (type < 101) {
            return status === type;
        } else {
            return status > 100;
        }
    }
    
    getTypeByCode(code) {
        if (code === 0) return 'pending';
        if (code === 1) return 'accepted';
        return 'rejected';
    }

    getReasonByCode(code) {
        if (code < 100) return null;
        for (const value of this.reasons.values()) {
            if (value.code === code) return value;
        }
        return null;
    }
}

export default new StatusKit();
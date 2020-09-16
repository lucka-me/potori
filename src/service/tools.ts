import i18next from 'i18next';

import { Constants as FileConst } from './file';
import Nomination from './nomination';

export class Parser {
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

export class BlobGenerator {
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
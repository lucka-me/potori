import i18next from 'i18next';

import { Constants as FileConst } from './file';
import Nomination from './nomination';

/**
 * Result of {@link Parser} methods
 */
interface ParseResult {
    matched: boolean,   // Whether the json matches the data structure or not
    message: string,    // Error message
}

/**
 * Result of {@link Parser.nominations}
 */
interface ParseNominationsResult extends ParseResult {
    nominations: Array<Nomination>  // Nomination list
}

/**
 * Result of {@link Parser.bsData}
 */
interface ParseBsDataResult extends ParseResult {
    data: Map<string, any>  // Brainstorming data map
}

/**
 * Parsers for files
 */
export class Parser {
    /**
     * Parse nomination list from JSON
     * @param json JSON string
     */
    static nominations(json: string): ParseNominationsResult {
        const result: ParseNominationsResult = {
            matched: false,
            message: '',
            nominations: []
        };
        try {
            const jsonList = JSON.parse(json);
            if (jsonList.length === 0) {
                result.message = i18next.t('message:service.tools.parseEmpty');
                return result;
            }
            for (const json of jsonList) {
                const nomination = Nomination.from(json);
                if (!nomination.id) {
                    result.nominations = [];
                    result.message = i18next.t('message:service.tools.parseNominationsFailed');
                    return result;
                }
                result.nominations.push(nomination);
            }
            result.matched = true;
        } catch(error) {
            result.matched = false;
            result.message = i18next.t('message:service.tools.parseNominationsFailed');
        }
        return result;
    }

    static bsData(content: string): ParseBsDataResult {
        const result: ParseBsDataResult = {
            matched: false,
            message: '',
            data: null,
        };
        try {
            result.data = new Map(JSON.parse(content));
            result.matched = true;
        } catch (error) {
            result.matched = false;
            result.message = i18next.t('message:service.tools.parseBsDataFailed');
        }

        return result;
    }
}

/**
 * Generate blob from data
 */
export class BlobGenerator {
    /**
     * Generate blob from nomination list
     * @param nominations Nomination list
     */
    static nominations(nominations: Array<Nomination>): Blob {
        const list = [];
        for (const nomination of nominations) {
            list.push(nomination.json);
        }
        
        return new Blob(
            [ JSON.stringify(list, null, 4) ],
            { type: FileConst.type }
        );
    }

    /**
     * Generate blob from Brainstorming data map
     * @param data Brainstorming data map
     */
    static bsData(data: Map<string, any>) {
        return new Blob(
            [ JSON.stringify([...data], null, 4) ],
            { type: FileConst.type }
        );
    }
}
const StringKeyBase = 'service.brainstorming';

export enum QueryFailReason {
    FIREBASE_ERROR  = 'message:service.brainstorming.firebaseError',    // Unable to query firebase
    NOT_EXISTS      = 'message:service.brainstorming.notExists',        // Nomination not exists in local database or firebase
    EARLY           = 'message:service.brainstorming.early',            // Nomination got result before firebase exists
};

export const RateItems = {
    quality:        `${StringKeyBase}.quality`,
    description:    `${StringKeyBase}.description`,
    cultural:       `${StringKeyBase}.cultural`,
    uniqueness:     `${StringKeyBase}.uniqueness`,
    safety:         `${StringKeyBase}.safety`,
    location:       `${StringKeyBase}.location`,
};
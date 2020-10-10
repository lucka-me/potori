export enum QueryFailReason {
    FIREBASE_ERROR  = 'message:service.brainstorming.firebaseError',    // Unable to query firebase
    NOT_EXISTS      = 'message:service.brainstorming.notExists',        // Nomination not exists in local database or firebase
    EARLY           = 'message:service.brainstorming.early',            // Nomination got result before firebase exists
};

export const RateItems = {
    quality:        'service.brainstorming.quality',
    description:    'service.brainstorming.description',
    cultural:       'service.brainstorming.cultural',
    uniqueness:     'service.brainstorming.uniqueness',
    safety:         'service.brainstorming.safety',
    location:       'service.brainstorming.location',
};
export enum QueryFailReason {
    FIREBASE_ERROR, // Unable to query firebase
    NOT_EXIST,      // Nomination not exists in local database or firebase
    EARLY,          // Nomination got result before firebase exists
};

export const RateItems = {
    quality:        'service.brainstorming.quality',
    description:    'service.brainstorming.description',
    cultural:       'service.brainstorming.cultural',
    uniqueness:     'service.brainstorming.uniqueness',
    safety:         'service.brainstorming.safety',
    location:       'service.brainstorming.location',
};
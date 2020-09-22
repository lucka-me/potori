export enum QueryFailReason {
    FIREBASE_ERROR, // Unable to query firebase
    NOT_EXIST,      // Nomination not exists in local database or firebase
};

export const RateItems = {
    quality:        'Quality',
    description:    'Description',
    cultural:       'Cultural',
    uniqueness:     'Uniqueness',
    safety:         'Safety',
    location:       'Location',
};
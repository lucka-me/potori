import { Module } from 'vuex';

import type { State } from '@/store/state';

export interface GoogleState {
    loaded: boolean;
    authed: boolean;
}

const googleModule: Module<GoogleState, State> = {
    namespaced: true,
    state: {
        loaded: false,
        authed: false,
    },
    mutations: {
        loaded(state: GoogleState) {
            state.loaded = true;
        },
        setAuthed(state: GoogleState, payload: boolean) {
            state.authed = payload;
        },
    }
}

export default googleModule;
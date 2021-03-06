import { createStore } from 'vuex'

import Nomination, { Predicator } from '@/service/nomination';

export namespace State {
    export enum Status {
        idle,
        processingMails,
        syncing
    }
}

export interface State {
    status: State.Status;
    gapiLoaded: boolean;
    gapiAuthed: boolean;
    nominations: Array<Nomination>;
}

export default createStore<State>({
    state: {
        status: State.Status.idle,
        gapiLoaded: false,
        gapiAuthed: false,
        nominations: [],
    },
    getters: {
        count: (state: State) => (predicator: Predicator) => {
            return state.nominations.filter(predicator).length;
        }
    },
    mutations: {
        setStatus(state: State, payload: State.Status) {
            state.status = payload;
        },
        gapiLoaded(state: State) {
            state.gapiLoaded = true;
        },
        setGAPIAuthed(state: State, payload: boolean) {
            state.gapiAuthed = payload;
        },
        setNominations(state: State, payload: Array<Nomination>) {
            state.nominations = payload;
        }
    },
    actions: {
    },
    modules: {
    }
});

import { createStore } from 'vuex'

import Nomination, { Predicator } from '@/service/nomination';

export namespace State {
    export enum Status {
        idle,
        processingMails,
        requestMatch,
        syncing
    }
}

export interface State {
    status: State.Status;
    progress: number;
    gapiLoaded: boolean;
    gapiAuthed: boolean;
    nominations: Array<Nomination>;
}

export default createStore<State>({
    state: {
        status: State.Status.idle,
        progress: 0,
        gapiLoaded: false,
        gapiAuthed: false,
        nominations: [],
    },
    getters: {
        empty(state: State) {
            return state.nominations.length < 1;
        },
        count: (state: State) => (predicator: Predicator) => {
            return state.nominations.filter(predicator).length;
        }
    },
    mutations: {
        setStatus(state: State, payload: State.Status) {
            state.status = payload;
        },
        setProgress(state: State, payload: number) {
            state.progress = payload;
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

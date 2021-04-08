import { Module } from 'vuex';

import type { State } from '@/store/state';

export interface ProgressState {
    progress: number;
    max: number;
}

const progressModule: Module<ProgressState, State> = {
    namespaced: true,
    state: {
        progress: 0,
        max: 0
    },
    mutations: {
        setProgress(state: ProgressState, payload: number) {
            state.progress = payload;
        },
        setMax(state: ProgressState, payload: number) {
            state.max = payload;
        }
    }
}

export default progressModule;
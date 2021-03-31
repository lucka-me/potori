import { Module } from 'vuex';

import type { State } from '@/store/state';

export interface DiaState {
    saveID: number;
}

const diaModule: Module<DiaState, State> = {
    namespaced: true,
    state: {
        saveID: 0
    },
    mutations: {
        saved(state: DiaState, _) {
            state.saveID++;
        }
    }
}

export default diaModule;
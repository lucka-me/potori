import { Module } from 'vuex';

import type { Predicator } from '@/service/nomination';
import type { State } from '@/store/state';
import type Nomination from '@/service/nomination';

export interface DataState {
    nominations: Array<Nomination>;
}

const dataModule: Module<DataState, State> = {
    namespaced: true,
    state: {
        nominations: []
    },
    getters: {
        empty(state: DataState) {
            return state.nominations.length < 1;
        },
        count: (state: DataState) => (predicator: Predicator) => {
            return state.nominations.filter(predicator).length;
        }
    },
    mutations: {
        setNominations(state: DataState, payload: Array<Nomination>) {
            state.nominations = payload;
        },
        deleteNomination(state: DataState, payload: string) {
            state.nominations = state.nominations.filter((nomination) => nomination.id !== payload);
        }
    }
}

export default dataModule;
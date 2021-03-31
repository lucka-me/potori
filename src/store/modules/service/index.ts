import { Module } from 'vuex';

import type { State } from '@/store/state';
import { ServiceStatus } from '@/service';

export interface ServiceState {
    status: ServiceStatus;
}

const serviceModule: Module<ServiceState, State> = {
    namespaced: true,
    state: {
        status: ServiceStatus.idle
    },
    mutations: {
        setStatus(state: ServiceState, payload: ServiceStatus) {
            state.status = payload;
        },
    }
}

export default serviceModule;
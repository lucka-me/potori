import { createStore } from 'vuex'

import type { State } from './state';
import google from './modules/google';
import data from './modules/data';
import progress from './modules/progress';
import service from './modules/service';

export default createStore<State>({
    modules: { service, google, progress, data }
});

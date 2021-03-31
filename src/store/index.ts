import { createStore } from 'vuex'

import type { State } from './state';
import google from './modules/google';
import dia from './modules/dia';
import progress from './modules/progress';
import service from './modules/service';

export default createStore<State>({
    modules: { service, dia, google, progress }
});

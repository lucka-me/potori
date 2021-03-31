import type { GoogleState } from './modules/google';
import type { DataState } from './modules/data';
import type { ProgressState } from './modules/progress';
import type { ServiceState } from './modules/service';

export interface State {
    service: ServiceState;
    progress: ProgressState;
    google: GoogleState
    data: DataState;
}
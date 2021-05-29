import { Store } from 'vuex'

import type { State } from '@/store/state';
import { util } from '@/service/utils';
import AuthKit from './auth';
import GoogleDriveKit from './drive';

export namespace google {

    export const auth = new AuthKit();
    export const drive = new GoogleDriveKit();

    export async function init(store: Store<State>) {
        await util.loadScript('https://apis.google.com/js/api.js');
        auth.events.authStatusChanged = (authed) => {
            store.commit('google/setAuthed', authed);
            store.commit('google/loaded');
        };
        auth.init();
    }
}
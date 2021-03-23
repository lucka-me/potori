export namespace preferences {

    export function set<T>(key: string, value: T) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    export function get<T>(key: string, def: T): T {
        const value = localStorage.getItem(key);
        if (value !== null) return JSON.parse(value);
        return def;
    }

    export namespace general {

        const keyQueryAfterLatest = 'potori.pref.general.queryAfterLatest';

        export function queryAfterLatest(): boolean { return preferences.get(keyQueryAfterLatest, false); }
        export function setQueryAfterLatest(value: boolean) { preferences.set(keyQueryAfterLatest, value); }
    }

    export namespace google {
        
        const keySync = 'potori.pref.google.sync';
        
        export function sync(): boolean { return preferences.get(keySync, false); }
        export function setSync(value: boolean) { preferences.set(keySync, value); }
    }

    export namespace brainstorming {

        const keyAutoQueryFirebase = 'potori.pref.brainstorming.autoQueryFirebase';

        export function autoQueryFirebase(): boolean { return preferences.get(keyAutoQueryFirebase, false); }
        export function setAutoQueryFirebase(value: boolean) { preferences.set(keyAutoQueryFirebase, value); }
    }
}
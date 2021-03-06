export namespace preferences {

    export function set<T>(key: string, value: T) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    export function get<T>(key: string, def: T): T {
        const value = localStorage.getItem(key);
        if (value !== null) return JSON.parse(value);
        return def;
    }

    export namespace google {
        
        const keySync = 'potori.pref.google.sync';
        
        export function sync(): boolean {
            return preferences.get(keySync, false);
        }
        export function setSync(value: boolean) {
            preferences.set(keySync, value);
        }
    }
}
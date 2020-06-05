import { UIKitPrototype } from './prototype.js';

class DialogKit extends UIKitPrototype {
    constructor() { super(); }

    init(parent) {
        for (const key of Object.keys(dialog)) {
            dialog[key].init(parent);
        }
    }
}

 export { DialogKit };
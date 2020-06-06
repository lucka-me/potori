import { UIKitPrototype } from "../protorypes.js";

export class DialogPrototype extends UIKitPrototype {
    constructor() {
        super();
        this.ctrl = null;
    }
    init(parent) { parent }
    open() { }
}
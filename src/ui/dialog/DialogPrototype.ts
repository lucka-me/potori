import { MDCDialog } from "@material/dialog";
import UIKitPrototype, { Eli } from "../UIKitPrototype";

export default class DialogPrototype extends UIKitPrototype {

    ctrl: MDCDialog = null;

    constructor() {
        super();
    }
    init(parent: HTMLElement) { parent }
}

export { Eli, MDCDialog };
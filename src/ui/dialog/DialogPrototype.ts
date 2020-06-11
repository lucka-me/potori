import { dialog } from "material-components-web";
import UIKitPrototype, { Eli } from "../UIKitPrototype";

export default class DialogPrototype extends UIKitPrototype {

    ctrl: dialog.MDCDialog = null;

    constructor() {
        super();
    }
    init(parent: HTMLElement) { parent }
}

export { Eli, dialog };
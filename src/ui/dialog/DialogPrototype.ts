import { dialog } from "material-components-web";
import UIKitPrototype, { Eli, i18next } from "../UIKitPrototype";

export default class DialogPrototype extends UIKitPrototype {
    ctrl: dialog.MDCDialog = null;
}

export { Eli, dialog, i18next };
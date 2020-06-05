import { Service } from "./service/Service.js";
import { UIKit } from "./ui/UIKit.js";

const service = new Service();
const ui = new UIKit();
window.service = service;
window.ui = ui;
service.init();
ui.init();
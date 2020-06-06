import Service from "./service/Service.js";
import UIKit from "./ui/UIKit.js";

Service.init();
const ui = new UIKit();
ui.init();
ui.linkService();

window.onGAPILoad = () => {
    Service.auth.handleClientLoad();
}
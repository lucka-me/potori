import Service from "./service/Service";
import UIKit from "./ui/UIKit";

Service.init();
const ui = new UIKit();
ui.init();
ui.linkService();
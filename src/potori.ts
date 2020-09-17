import service from "./service";
import UIKit from "./ui/UIKit";

service.init();
const ui = new UIKit();
ui.init();
ui.linkService();
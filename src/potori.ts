import UIKit from "./ui/UIKit";
import { service } from "./service";

service.init();
const ui = new UIKit();
ui.init();
ui.linkService();
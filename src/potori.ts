import UIKit from "./ui";
import { service } from "./service";

service.init();
const ui = new UIKit();
ui.init();
ui.linkService();
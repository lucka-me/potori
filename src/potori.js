import Service from "./service/Service.js";
import UIKit from "./ui/UIKit.js";

import '../css/extended.css'
import '../css/dark.css'

Service.init();
const ui = new UIKit();
ui.init();
ui.linkService();
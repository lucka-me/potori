import Service from "./service/Service";
import UIKit from "./ui/UIKit";

import './css/extended.css'
import './css/dark.css'

Service.init();
const ui = new UIKit();
ui.init();
ui.linkService();
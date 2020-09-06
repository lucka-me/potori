import Service from "./service/Service";
import UIKit from "./ui/UIKit";

import './css/extended.css'
import './css/dark.css'

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}

Service.init();
const ui = new UIKit();
ui.init();
ui.linkService();
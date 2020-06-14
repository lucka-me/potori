import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translations from "./locales";
import Service from "./service/Service";
import UIKit from "./ui/UIKit";

import '../css/extended.css'
import '../css/dark.css'

i18next
    .use(LanguageDetector)
    .init({
        fallbackLng: 'en-US',
        keySeparator: false,
        resources: translations,
        ns: ['general', 'message'],
        defaultNS: 'general',
    });

Service.init();
const ui = new UIKit();
ui.init();
ui.linkService();
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';

import { service } from './service';
import App from './App.vue';
import locales from './locales';
import router from './router';
import store from './store';

const i18n = createI18n({
    locale: navigator.language,
    fallbackLocale: 'en',
    messages: locales
});

service.init(store, i18n.global);
createApp(App)
    .use(i18n)
    .use(store)
    .use(router)
    .mount('#app');

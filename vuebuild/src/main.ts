import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { BASE } from './config';
import axios from 'axios';
import App from './App.vue';
import VueAxios from 'vue-axios';
import notify from 'vue3-notification';

import en from './assets/en.json';
import cn from './assets/cn.json';
import fr from './assets/fr.json';

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    'en': {...en,},
    'cn': {...cn,},
    'fr': {...fr,}
  }
});

const app = createApp(App);
app.use(i18n);
app.use(notify);
app.use(VueAxios, axios);
app.axios.defaults.baseURL = BASE;
app.provide('axios', app.config.globalProperties.axios);
app.mount('#app');

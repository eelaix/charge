import Vue from 'vue';
import axios from 'axios'
import VueI18n from 'vue-i18n';
import { BASE } from '@/config';
import VueAxios from 'vue-axios';
import Chargerbk from './Chargerbk.vue';
import {CardPlugin,IconsPlugin,BootstrapVue} from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.use(VueI18n);
Vue.use(CardPlugin);
Vue.use(IconsPlugin);
Vue.use(BootstrapVue);
Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.axios.defaults.baseURL = BASE;
Vue.prototype.$pagesize = 12;
let lpagesize = window.localStorage.getItem('_pagesize');
if ( lpagesize ) { Vue.prototype.$pagesize = lpagesize; }

const i18n = new VueI18n({
  locale: localStorage.getItem('locale') || 'EN',
  messages: {
    'EN': require('./assets/en'),
    'FR': require('./assets/fr'),
    'CN': require('./assets/cn')
  }
});

Vue.filter('trans', function (engstr) {
  let lo = localStorage.getItem('locale') || 'EN';
  let trastr = i18n.messages[lo].message[engstr];
  if (trastr){
    return trastr;
  } else {
    return engstr;
  }
});

new Vue({
  i18n,
  render: h => h(Chargerbk),
  data() {return {};},
  methods: {}
}).$mount('#app1');

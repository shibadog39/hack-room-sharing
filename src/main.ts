import Vue from 'vue';
import vuetify from '@/plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import firebase from 'firebase';
import firebaseConf from './config/firebase';

Vue.config.productionTip = false;
firebase.initializeApp(firebaseConf);
new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');

import Vue from 'vue';
import './plugins/vuetify';
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
  render: h => h(App)
}).$mount('#app');

import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify, {
  theme:     {
    primary: '#009688',
    secondary: '#607d8b',
    },
  iconfont: 'mdi',
});

export default new Vuetify({
    icons: {
             iconfont: 'mdi',
       }
});

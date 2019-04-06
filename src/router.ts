import Vue from 'vue';
import Router from 'vue-router';
// import Signup from './components/Signup.vue';
import Signin from './components/Signin.vue';
import Payment from './components/Payment.vue';
import firebase from 'firebase';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Payment',
      component: Payment,
      meta: { requiresAuth: true }
    },
    // {
    //   path: "/signup",
    //   name: "Signup",
    //   component: Signup
    // },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    }
  ]
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth) {
    // このルートはログインされているかどうか認証が必要です。
    // もしされていないならば、ログインページにリダイレクトします。
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        next();
      } else {
        next({
          path: '/signin',
          query: { redirect: to.fullPath }
        });
      }
    });
  } else {
    next(); // next() を常に呼び出すようにしてください!
  }
});

export default router;

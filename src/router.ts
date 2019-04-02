import Vue from "vue";
import Router from "vue-router";
import Payment from "./components/Payment.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Payment",
      component: Payment
    }
  ]
});

export default router;

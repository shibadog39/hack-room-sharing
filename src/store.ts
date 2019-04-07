import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    yetItemFromDB: null,
    completedItemFromDB: null
  },

  mutations: {
    updateYetItemFromDB(state, payload) {
      state.yetItemFromDB = payload;
    },
    updateCompletedItemFromDB(state, payload) {
      state.completedItemFromDB = payload;
    }
  }
});
export default store;

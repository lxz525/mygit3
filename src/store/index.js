import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    uname: "",
    role:"",
    password:"",
    empno:"",
    dname:"",
    closePage:""
  },
  getters: {
  },
  mutations: {
    setClosePage(state,closePage) {
      if(closePage != null) {
        state.closePage = closePage
      } else {
        state.closePage = ""
      }
    }
  },
  actions: {
  },
  modules: {
  }
})

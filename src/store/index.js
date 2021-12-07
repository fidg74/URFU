import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import api from './modules/api'
import user from './modules/user'
import project from './modules/project'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    api,
    user,
    project
  },
  // plugins: [createPersistedState()],
  strict: process.env.DEV
})
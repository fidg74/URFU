import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

const Router = new VueRouter({
    // mode: 'history',
    routes,
    scrollBehavior () {
      const shellMain = document.querySelector('.shell-main')
      if (shellMain) shellMain.scrollTop = 0
      return { x: 0, y: 0 }
    }
})

export default Router

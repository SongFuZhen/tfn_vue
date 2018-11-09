import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import routes from './routes'
import App from './App.vue'
import axios from 'axios'
import VueCookies from 'vue-cookies'

Vue.config.debug = true;//开启错误提示

Vue.use(ElementUI, axios, VueRouter, VueCookies)

const router = routes

// 全局导航钩子
router.beforeEach((to, from, next) => {
  // 判断该路由是否需要登录权限
  if (to.meta.requireAuth) {
    // 通过vuex state获取当前的token是否存在
    const cookies = VueCookies.get('tfn_cookies')

    if (cookies !== null) {
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }
  else {
    next()
  }
})

new Vue({
  el: '#app',
  router,
  render: h => h(App),
})
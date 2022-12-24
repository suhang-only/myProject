import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './assets/less/index.less'
import store from './store'
import './api/mock.js'
import api from './api/api'
import * as echarts from 'echarts'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.config.globalProperties.$api = api
function checkRouter(path) {
  let hasCheck = router.getRoutes().filter((route) => route.path == path).length
  if (hasCheck) {
    return true
  } else {
    return false
  }
}
router.beforeEach((to, from, next) => {
  store.commit('getToken')
  const token = store.state.token
  if (!token && to.name !== 'login') {
    next({ name: 'login' })
  } else if (!checkRouter(to.path)) {
    next({ name: 'home' })
  } else {
    next()
  }
})
app.use(ElementPlus).use(router).use(store)
app.config.globalProperties.$echarts = echarts
app.mount('#app')

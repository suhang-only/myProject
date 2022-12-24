import { createStore } from 'vuex'
import Cookie from 'js-cookie'
export default createStore({
  state: {
    isCollapse: true,
    currentMenu: null,
    tabsList: [
      {
        path: '/',
        name: 'home',
        label: '首页',
        icon: 'home',
      },
    ],
    menu: [],
    token: '',
  },
  mutations: {
    updateIsCollapse(state, payload) {
      state.isCollapse = !state.isCollapse
    },
    selectMenu(state, val) {
      // val.name === 'home'
      //   ? (state.currentMenu = null)
      //   : (state.currentMenu = val)
      if (val.name === 'home') {
        state.currentMenu = null
      } else {
        state.currentMenu = val
        let result = state.tabsList.findIndex((item) => item.name === val.name)
        if (result == -1) {
          state.tabsList.push(val)
        }
      }
    },
    closeTab(state, val) {
      let res = state.tabsList.findIndex((item) => item.name === val.name)
      state.tabsList.splice(res, 1)
    },
    setMenu(state, val) {
      state.menu = val
      localStorage.setItem('menu', JSON.stringify(val))
    },
    addMenu(state) {
      if (!localStorage.getItem('menu')) {
        return
      }
      const menu = JSON.parse(localStorage.getItem('menu'))
      state.menu = menu
    },
    cleanMenu(state) {
      state.menu = []
      localStorage.removeItem('menu')
    },
    setToken(state, val) {
      state.token = val
      Cookie.set('token', val)
    },
    clearToken(state) {
      state.token = ''
      Cookie.remove('token')
    },
    getToken(state) {
      state.token = state.token || Cookie.get('token')
    },
  },
})

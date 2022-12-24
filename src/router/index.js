import { createRouter, createWebHashHistory } from 'vue-router'
import Main from '../views/Main.vue'
import Home from '../views/home/Home.vue'
import User from '../views/user/User.vue'
import PageOne from '../views/Page1.vue'
import PageTwo from '../views/Page2.vue'
import Login from '../views/Login.vue'
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: Main,
      name: 'home',
      redirect: '/',
      children: [
        { path: '/', name: 'home', component: Home },
        { path: 'user', name: 'user', component: User },
        // { path: 'mall', component: Mall },
        { path: 'page1', name: 'page1', component: PageOne },
        { path: 'page2', name: 'page2', component: PageTwo },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
  ],
})
export default router

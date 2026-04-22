import { createRouter, createWebHistory } from 'vue-router'
import { showLoader, hideLoader } from '../composables/useLoader'

// Layout
import AppLayout from '../layouts/AppLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'

// Pages
import Login from '../pages/auth/Login.vue'
import Register from '../pages/auth/Register.vue'

import Home from '../pages/app/Home.vue'
import Add from '../pages/app/Add.vue'
import Report from '../pages/app/Report.vue'
import Chat from '../pages/app/Chat.vue'
import Profile from '../pages/app/Profile.vue'



const routes = [
  {
    path: '/',
    component: AuthLayout,
    children: [
      { path: '', redirect: '/login' },
      { path: 'login', component: Login },
      { path: 'register', component: Register }
    ]
  },
  {
    path: '/app',
    component: AppLayout,
    children: [
      { path: 'home', component: Home },
      { path: 'add', component: Add },
      { path: 'report', component: Report },
      { path: 'chat', component: Chat },
      { path: 'profile', component: Profile }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🔥 sebelum pindah halaman → tampilkan loader
router.beforeEach((to, from, next) => {
  showLoader()
  next()
})

// 🔥 setelah halaman selesai → sembunyikan loader
router.afterEach(() => {
  setTimeout(() => {
    hideLoader()
  }, 500) // kasih delay biar smooth
})

export default router
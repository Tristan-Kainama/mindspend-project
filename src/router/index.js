import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Home from '../pages/Home.vue'
import Chat from '../pages/Chat.vue'

const routes = [
  { path: '/', component: Home },  
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/chat', component: Chat }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
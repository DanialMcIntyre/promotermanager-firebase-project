import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/authentication/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/authentication/Register.vue')
  },
  {
    path: '/phonenumber',
    name: 'PhoneNumber',
    component: () => import('../views/authentication/PhoneNumber.vue')
  },
  {
    path: '/passwordreset',
    name: 'PasswordReset',
    component: () => import('../views/authentication/PasswordReset.vue')
  },
  {
    path: '/passwordforgot',
    name: 'PasswordForgot',
    component: () => import('../views/authentication/PasswordForgot.vue')
  },
  {
    path: '/guests',
    name: 'Guests',
    component: () => import('../views/guests/Guests.vue')
  },
  {
    path: '/guests/createguest',
    name: 'CreateGuest',
    component: () => import('../views/guests/CreateGuest.vue')
  },
  {
    path: '/guests/viewguests',
    name: 'ViewGuests',
    component: () => import('../views/guests/ViewGuests.vue')
  },
  {
    path: '/events',
    name: 'Events',
    component: () => import('../views/events/Events.vue')
  },
  {
    path: '/events/createevent',
    name: 'CreateEvent',
    component: () => import('../views/events/CreateEvent.vue')
  },
  {
    path: '/events/viewevents',
    name: 'ViewEvents',
    component: () => import('../views/events/ViewEvents.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
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
    path: '/verifyaccount',
    name: 'VerifyAccount',
    component: () => import('../views/authentication/VerifyAccount.vue')
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
  },
  {
    path: '/events/viewevents/:eventdetails',
    name: 'Event',
    component: () => import('../views/events/EventDetails.vue')
  },
  {
    path: '/:catchAll(.*)',
    name: 'Home',
    component: () => import('../views/Home.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

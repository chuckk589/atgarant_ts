import Vue from 'vue'
import Router from 'vue-router'

// Containers
const TheContainer = () => import('../containers/TheContainer')

// Views
const Offers = () => import('../views/Offers')
const Settings = () => import('../views/Settings')
const Arbitrary = () => import('../views/Arbitrary')
const Users = () => import('../views/Users')
const Login = () => import('../views/Login')


Vue.use(Router)

const router = new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
})
// router.beforeEach((to, from, next) => {
//   if (to.params.skipAuth) {
//     next()
//   } else {
//     if (to.matched.some(record => record.meta.requiresAuth)) {
//       router.app.$http.post('/v1/user/auth/', null, { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } })
//         .then(() => next())
//         .catch((er) => {
//           console.log(er)
//           next({ path: '/login', params: { nextUrl: to.fullPath } })
//         })
//     } else {
//       next()
//     }
//   }
// })
export default router
function configRoutes() {
  return [
    {
      path: '/login',
      name: 'Login',
     // meta: { requiresAuth: false },
      component: Login,
    },
    {
      path: '/',
      name: 'Home',
      redirect: { name: 'Offers' },
      component: TheContainer,
     // meta: { requiresAuth: true },
      children: [
        {
          path: 'offers',
          name: 'Offers',
          //meta: { requiresAuth: true },
          component: Offers
        },
        {
          path: 'arbitrary',
          name: 'Arbitrary',
         // meta: { requiresAuth: true },
          component: Arbitrary
        },
        {
          path: 'settings',
          name: 'Settings',
         // meta: { requiresAuth: true },
          component: Settings
        },
        {
          path: 'users',
          name: 'Users',
         // meta: { requiresAuth: true },
          component: Users
        }]
    }
  ]
}


import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    redirect: '/home/index',
    component: () => import('../views/Layout/Index.vue'),
    children: [
      {
        path: '/home',
        redirect: '/home/index'
      },
      {
        path: '/home/index',
        components: {
          default: () => import('../views/Home/Index.vue'),
          Home: () => import('../views/Home/Index.vue'),
          AccountManage: () => import('../views/SysManagement/Account.vue'),
          SystemManage: () => import('../views/SysManagement/System.vue'),
        },
      }
    ]
  },
  {
    path: '/login/signIn',
    name: 'SignIn',
    component: () => import('../views/Login/SignIn.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/Test/test.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

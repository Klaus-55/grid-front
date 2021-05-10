import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/keguan'
  },
  {
    path: '/zhongduan',
    component: () => import("../views/zhongduan/HeadMenu")
  },
  {
    path: '/duanlin',
    component: () => import("../views/duanlin/HeadMenu")
  },
  {
    path: '/keguan',
    component: () => import("../views/keguan/HeadMenu"),

  },
  {
    path: '/keguan/test',
    component: () => import("../views/keguan/HeadMenu"),

  },
  {
    path: '/provincial',
    component: () => import("../views/shengji/HeadMenu")
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router

import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },{
    path: '/directive',
    name: 'directive',
    component: () => import('../views/Directives.vue')
  },
  {
    path: "/charts" ,
    name : "charts" ,
    component: () => import("../views/Charts.vue")
  },
  {
    path: "/highChart" ,
    name : "highChart" ,
    component: () => import("../views/High.vue")
  },
  {
    path: "/relation" ,
    name : "relation" ,
    component: () => import("../views/Relation.vue")
  },
  {
    path: "/jsplumb" ,
    name : "jsplumb" ,
    component: () => import("../views/JsPlumb.vue")
  },
  {
    path: "/echarts" ,
    name : "echarts" ,
    component: () => import("../views/echarts.vue")
  },
  {
    path: "/editor" ,
    name : "editor" ,
    component: () => import("../views/editor.vue")
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

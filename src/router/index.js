import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

export const routes = [
    {
        path: '/',
        name: 'index',
        hidden : true ,
        redirect:'/home',

    },
    {
        path: '/home',
        name: 'Home',
        component: Home
    },
    {
        path: '/about',
        name: 'About',
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }, {
        path: '/directive',
        name: 'directive',
        component: () => import('../views/Directives.vue')
    },
    {
        path: "/charts",
        name: "charts",
        component: () => import("../views/Charts.vue")
    },
    {
        path: "/highChart",
        name: "highChart",
        component: () => import("../views/High.vue")
    },
    {
        path: "/relation",
        name: "relation",
        component: () => import("../views/Relation.vue")
    },
    {
        path: "/jsplumb",
        name: "jsplumb",
        component: () => import("../views/JsPlumb.vue")
    },
    {
        path: "/echarts",
        name: "echarts",
        component: () => import("../views/echarts.vue")
    },
    {
        path: "/editor",
        name: "editor",
        component: () => import("../views/editor.vue")
    }, {
        path: '/draggable',
        name: "draggable",
        component: () => import("@/views/plug-components/draggable")
    }, {
        path: '/sortable',
        name: "sortable",
        component: () => import("@/views/plug-components/sortable")
    }, {
        path: "/v4.0",
        name: "dc4",
        component: () => import("@/views/dc4.0")
    }, {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/dashboard")
    }, {
        path: "/splitlayout",
        name: "vue-split-layout",
        component: () => import("@/views/vue-split-layout")
    }, {
        path: "/panorama",
        name: "panorama",
        component: () => import("@/views/Panorama")
    }
];
Vue.use(VueRouter);
export function getMenu() {
    return routes.filter(rou => !rou.hidden);
}
export default routes

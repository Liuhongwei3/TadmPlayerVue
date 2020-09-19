import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: "/top",
        name: "Top",
        component: () =>
            import ( /* webpackChunkName: "1" */ '@/views/Top.vue'),
        meta: { keepAlive: true }
    },
    {
        path: "/hotDetail",
        name: "HotDetail",
        component: () =>
            import ( /* webpackChunkName: "2" */ '@/views/HotDetail.vue'),
        meta: { keepAlive: true }
    },
    {
        path: "/search",
        name: "Search",
        component: () =>
            import ( /* webpackChunkName: "1" */ '@/views/Search.vue'),
        meta: { keepAlive: true }
    },
    {
        path: "/singer",
        name: "Singer",
        component: () =>
            import ( /* webpackChunkName: "1" */ '@/views/Singer.vue'),
        meta: { keepAlive: false }
    },
    {
        path: "/user",
        name: "User",
        component: () =>
            import ( /* webpackChunkName: "1" */ '@/views/User.vue'),
        meta: { keepAlive: false }
    },
    {
        path: "/detail",
        name: "Detail",
        component: () =>
            import ( /* webpackChunkName: "2" */ '@/views/Detail.vue'),
        meta: { keepAlive: false }
    },
    {
        path: "/comment",
        name: "Comment",
        component: () =>
            import ( /* webpackChunkName: "2" */ '@/views/Comment.vue'),
        meta: { keepAlive: true }
    },
    {
        path: '/about',
        name: 'About',
        component: () =>
            import ( /* webpackChunkName: "2" */ '@/views/About.vue')
    }
]

const router = new VueRouter({
    // mode: 'history',
    mode: 'hash',
    base: process.env.BASE_URL,
    routes,
    // scrollBehavior(to, from, savedPosition) {
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             resolve({ x: 0, y: 0 })
    //         }, 500)
    //     })
    // }
})

export default router
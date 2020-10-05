import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: "/top",
        name: "Top",
        component: () =>
            import ( /* webpackChunkName: "1" */ '@/views/Top.vue'),
    },
    {
        path: "/hotDetail",
        name: "HotDetail",
        component: () =>
            import ( /* webpackChunkName: "2" */ '@/views/HotDetail.vue'),
    },
    {
        path: "/search",
        name: "Search",
        component: () =>
            import ( /* webpackChunkName: "1" */ '@/views/Search.vue'),
    },
    {
        path: "/singer",
        name: "Singer",
        component: () =>
            import ( /* webpackChunkName: "1" */ '@/views/Singer.vue'),
    },
    {
        path: "/user",
        name: "User",
        component: () =>
            import ( /* webpackChunkName: "1" */ '@/views/User.vue'),
    },
    {
        path: "/detail",
        name: "Detail",
        component: () =>
            import ( /* webpackChunkName: "2" */ '@/views/Detail.vue'),
    },
    {
        path: "/comment",
        name: "Comment",
        component: () =>
            import ( /* webpackChunkName: "2" */ '@/views/Comment.vue'),
    },
    {
        path: '/about',
        name: 'About',
        component: () =>
            import ( /* webpackChunkName: "2" */ '@/views/About.vue')
    }
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes,
})

export default router
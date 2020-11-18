import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/top",
    name: "Top",
    component: () => import(/* webpackChunkName: "1" */ "@/views/Top.vue"),
  },
  {
    path: "/home",
    name: "Home",
    component: () => import(/* webpackChunkName: "2" */ "@/views/Home.vue"),
  },
  {
    path: "/hotDetail",
    name: "HotDetail",
    component: () =>
      import(/* webpackChunkName: "1" */ "@/views/HotDetail.vue"),
  },
  {
    path: "/search",
    name: "Search",
    component: () => import(/* webpackChunkName: "1" */ "@/views/Search.vue"),
  },
  {
    path: "/singer",
    name: "Singer",
    component: () => import(/* webpackChunkName: "1" */ "@/views/Singer.vue"),
  },
  {
    path: "/user",
    name: "User",
    component: () => import(/* webpackChunkName: "1" */ "@/views/User.vue"),
  },
  {
    path: "/detail",
    name: "Detail",
    component: () => import(/* webpackChunkName: "2" */ "@/views/Detail.vue"),
  },
  {
    path: "/history",
    name: "History",
    component: () => import(/* webpackChunkName: "1" */ "@/views/History.vue"),
  },
  {
    path: "/comment",
    name: "Comment",
    component: () => import(/* webpackChunkName: "2" */ "@/views/Comment.vue"),
  },
  {
    path: "/mv",
    name: "Mv",
    component: () => import(/* webpackChunkName: "2" */ "@/views/Mv.vue"),
  },
  {
    path: "/showMv",
    name: "ShowMv",
    component: () =>
      import(/* webpackChunkName: "2" */ "../components/content/ShowMv.vue"),
  },
  {
    path: "/showVideo",
    name: "ShowVideo",
    component: () =>
      import(/* webpackChunkName: "2" */ "../components/content/ShowVideo.vue"),
  },
  {
    path: "/myvideo",
    name: "MyVideo",
    component: () => import(/* webpackChunkName: "1" */ "@/views/MyVideo.vue"),
  },
  {
    path: "/album",
    name: "Album",
    component: () => import(/* webpackChunkName: "2" */ "@/views/Album.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () => import(/* webpackChunkName: "2" */ "@/views/About.vue"),
  },
  {
    path: "/kugou/detail",
    name: "Kugou",
    component: () =>
      import(/* webpackChunkName: "2" */ "@/views/kugou/Detail.vue"),
    // children: [
    //   {
    //     path: "/detail",
    //     name: "KugouDetail",
    //     component: () =>
    //       import(/* webpackChunkName: "2" */ "@/views/kugou/Detail.vue"),
    //   },
    // ],
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;

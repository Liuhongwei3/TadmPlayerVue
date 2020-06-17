/*
 * https://liuhongwei3.github.io Inc.
 * Name: index.js
 * Date: 2020/1/30 上午9:46
 * Author: Tadm
 * Copyright (c) 2020 All Rights Reserved.
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import search from "../views/search";
import user from "../views/user";

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'home',
    component: Home,
    // children: [
    //   {
    //     path: '/player',
    //     name: 'play',
    //     component: () => import('../views/Play')
    //   }
    // ]
  },
  {
    path: '/top',
    name: 'top',
    component: () => import('../views/top')
  },
  {
    path: '/hotDetail',
    name: 'hotDetail',
    component: () => import('../views/hotDetail')
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('../views/user')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/search')
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('../views/detail')
  },
  {
    path: '/comment',
    name: 'comment',
    component: () => import('../views/Comment')
  },
  {
    path: '/singer',
    name: 'singer',
    component: () => import('../views/Singer')
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router

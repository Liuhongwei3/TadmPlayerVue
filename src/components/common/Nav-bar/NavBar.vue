<!--
  - https://liuhongwei3.github.io Inc.
  - Name: NavBar.vue
  - Date: 2020/2/11 上午11:46
  - Author: Tadm
  - Copyright (c) 2020 All Rights Reserved.
  -->

<template>
  <div class="nav-wrapper">
    <div class="nav-content">
      <router-link to="/home" @click.native="dbClickTop('/home')">
        发现音乐
      </router-link>
      <router-link to="/top" @click.native="dbClickTop('/top')">
        巅峰榜
      </router-link>
      <router-link to="/hotDetail" @click.native="dbClickTop('/hotDetail')"
        >热门歌单</router-link
      >
      <router-link to="/search" @click.native="dbClickTop('/search')"
        >搜索</router-link
      >
      <router-link to="/singer" @click.native="dbClickTop('/singer')"
        >歌手</router-link
      >
      <router-link to="/user" @click.native="dbClickTop('/user')"
        >用户</router-link
      >
      <router-link to="/detail" @click.native="dbClickTop('/detail')"
        >歌单</router-link
      >
      <router-link to="/history" @click.native="dbClickTop('/history')"
        >历史</router-link
      >
      <router-link to="/album" @click.native="dbClickTop('/album')"
        >专辑</router-link
      >
      <router-link to="/comment" @click.native="dbClickTop('/comment')"
        >评论</router-link
      >
      <router-link to="/mv" @click.native="dbClickTop('/mv')">MV</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  methods: {
    dbClickTop(path) {
      if (this.$route.path === path) {
        this.$emit("toTop");
      }
    },
  },
};
</script>


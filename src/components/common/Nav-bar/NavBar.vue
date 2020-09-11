<!--
  - https://liuhongwei3.github.io Inc.
  - Name: NavBar.vue
  - Date: 2020/2/11 上午11:46
  - Author: Tadm
  - Copyright (c) 2020 All Rights Reserved.
  -->

<template>
  <horizontal-scroll class="nav-wrapper" :probe-type="3">
    <div class="nav-content">
      <router-link to="/">Home</router-link>
      |
      <router-link to="/top">巅峰榜</router-link>
      |
      <router-link to="/hotDetail">热门歌单</router-link>
      |
      <router-link to="/search">搜索</router-link>
      |
      <router-link to="/singer">歌手</router-link>
      |
      <router-link to="/user">用户</router-link>
      |
      <router-link to="/detail">歌单</router-link>
      |
      <router-link to="/comment">评论</router-link>
    </div>
  </horizontal-scroll>
</template>

<script>
import HorizontalScroll from "@/components/common/scroll/HorizontalScroll";

export default {
  name: "NavBar",
  components: {
    HorizontalScroll,
  },
};
</script>

<style scoped>
.nav-wrapper {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  position: sticky;
  top: 5px;
  z-index: 1;
}

.nav-content {
  display: inline-block;
  font-size: 16px;
  text-align: center;
  padding: 0 10%;
}

a {
  display: inline-block;
  height: 32px;
  line-height: 32px;
  color: #c0c0c0;
}

a.router-link-exact-active {
  font-size: 18px;
  font-weight: 700;
  color: #8db946;
  border: 1px solid #aa8e14;
  border-radius: 10%;
  background-color: #575555;
}
</style>

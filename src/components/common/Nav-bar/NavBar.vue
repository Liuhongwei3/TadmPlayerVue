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
      <router-link to="/top">
        <span> 巅峰榜</span>
      </router-link>
      <router-link to="/hotDetail">热门歌单</router-link>
      <router-link to="/search">搜索</router-link>
      <router-link to="/singer">歌手</router-link>
      <router-link to="/user">用户</router-link>
      <router-link to="/detail">歌单</router-link>
      <router-link to="/comment">评论</router-link>
      <router-link to="/mv">MV</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBar",
};
</script>

<style scoped>
.nav-wrapper {
  position: absolute;
  left: 0;
  top: 32px;
  width: 10vw;
  overflow: hidden;
}

.nav-content {
  font-size: 16px;
  white-space: nowrap;
}

i {
  color: #fff;
}

a {
  display: block;
  height: 32px;
  line-height: 32px;
  color: #c0c0c0;
  text-decoration: none;
  margin: 10px 0;
}

a.router-link-exact-active {
  font-size: 18px;
  font-weight: 700;
  color: #e5e5e5;
}

@media screen and (max-width: 768px) {
  .nav-wrapper {
    width: 18vw;
  }
}
</style>

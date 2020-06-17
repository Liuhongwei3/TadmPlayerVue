<!--
  - https://liuhongwei3.github.io Inc.
  - Name: NavBar.vue
  - Date: 2020/2/11 上午11:46
  - Author: Tadm
  - Copyright (c) 2020 All Rights Reserved.
  -->

<template>
  <div id="nav">
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
	<slot></slot>
  </div>
</template>

<script>
  export default {
    name: "NavBar",
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style scoped>
  #nav {
	height: 7vh;
	padding: 12px;
	position: sticky;
	top: 0;
	background-color: #5eff8b63;
	z-index: 1;
  }

  #nav a {
	font-weight: bold;
	line-height: 32px;
	color: #2c3e50;
  }

  #nav a.router-link-exact-active {
	color: #ff633c;
  }

  @media screen and (max-width: 768px) {
	#nav {
	  height: 11vh;
	  padding: 12px;
	  display: flex;
	  flex-wrap: wrap;
	  justify-content: space-around;
	}

	#nav a {
	  line-height: 24px;
	}
  }
</style>

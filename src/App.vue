<!--
  - https://liuhongwei3.github.io Inc.
  - Name: App.vue
  - Date: 2020/1/30 上午9:46
  - Author: Tadm
  - Copyright (c) 2020 All Rights Reserved.
  -->

<template>
  <div id="app" v-cloak>
	<nav-bar>
	  <span class="user" v-if="userId === 0">
        <input id="userIdInput" class="input-group-text" type="text" @keyup.enter="login"
			   placeholder="Input your NetEase userId~">
        <button class="btn btn-info" type="button" @click="login">Login</button>
      </span>
	  <span class="user" v-else>
        <img :src="userImgUrl" class="userImg" alt="">
         <button class="btn btn-info btn-sm" type="button" @click="toUser">
           <span class="userNm">{{ userName }}</span>
        </button>
        <button type="button" class="btn btn-sm btn-secondary dropdown-toggle dropdown-toggle-split"
				data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span class="sr-only">Toggle Dropdown</span>
        </button>
        <div class="dropdown-menu">
          <a class="dropdown-item" href="#" @click.prevent="logout">退出</a>
        </div>
      </span>
	</nav-bar>
	<alert :flag="alertFlag1" :time="this.time*1000" @closeAlert="hiddenAlert" class="alert-success">
	  Welcome to Tadm-Player: <span class="userNameAlert">{{ this.userName }}</span><br/>
	  <span class="time">{{ this.time }}</span> 秒后进入到用户界面尽情享受音乐的美好与快乐~
	</alert>
	<alert :flag="alertFlag2" :time="this.time*1000" @closeAlert="hiddenAlert" class="alert-info">
	  <p>您还没有输入您的 ID (数字)哟~ 更多登录信息可进入用户界面查看~</p>
	</alert>
	<div class="center">
	  <div class="top">
		<Home class="home"></Home>
	  </div>
	  <div class="bottom">
		<v-touch @swipeleft="swiperLeft" @swiperight="swiperRight" class="wrapper">
		  <scroll class="content" ref="scroll" :probe-type="3" :pull-up-load="true" @scroll="contentScroll"
				  @pullingUp="loadMore">
			<div>
			  <transition name="fade">
				<router-view/>
			  </transition>
			  <About></About>
			</div>
			<back-top class="backTop" @backTop="backTop" v-show="showBackTop">
			  <i class="fa fa-arrow-up fa-2x" aria-hidden="true"></i>
			</back-top>
		  </scroll>
		</v-touch>
	  </div>
	</div>
	<!--    <About v-show="this.$route.path !== '/about'"></About>-->
  </div>
</template>

<script>
  import './css/App.css'

  import debounce from "./utils";
  import {userDetail} from "./network/Top";

  import Home from "./views/Home";
  import About from "./views/About";
  import Scroll from "./components/common/scroll/Scroll";
  import top from "./views/top";
  import User from "./views/user";
  import BackTop from "./components/common/backTop/BackTop";
  import NavBar from "./components/common/Nav-bar/NavBar";
  import Alert from "./components/common/alert/Alert";

  export default {
    name: 'App',
    data() {
      return {
        userId: 537069044,
        userName: '',
        userImgUrl: '',
        time: 3,
        show: true,
        showBackTop: false,
        alertFlag1: false,
        alertFlag2: false,
        routes: ['/', '/top', '/hotDetail', '/search', '/singer', '/user', '/detail'],

        // springTestData: []
      }
    },
    components: {
      Alert,
      NavBar,
      BackTop,
      User,
      Scroll,
      Home,
      About,
      top
    },
    created() {
      console.log('Welcome to Tadm-Player ~ ');
      let localuid = localStorage.getItem('userId');
      if (localuid != null) {
        this.$store.commit('updateUserId', localuid)
      } else {
        this.$store.commit('updateUserId', 0)
      }
      this.userId = this.$store.state.userId
      this.userName = this.$store.state.userName
      let uid = this.userId
      this.requestUser(uid)
    },
    watch: {
      userId(newValue) {
        this.requestUser(newValue)
      }
    },
    methods: {
      login() {
        this.userId = $('#userIdInput')[0].value
        if (this.userId.length !== 0) {
          this.$store.commit('updateUserId', this.userId)
          localStorage.setItem('userId', this.userId);
          if (this.$route.path === '/user') {
            this.toHome()
          }
          this.alertFlag1 = true
          let timeInter = setInterval(() => {
            this.time--
          }, 1000)

          setTimeout(() => {
            clearInterval(timeInter)
            this.toUser(this.userId)
          }, 3000)

        } else {
          this.userId = 0
          this.alertFlag2 = true
        }
      },
      requestUser(uid) {
        userDetail(uid).then(res => {
          if (res.data.code === 200) {
            this.userName = res.data.profile.nickname
            this.userImgUrl = res.data.profile.avatarUrl
          } else {
            this.userId = 0
          }
        })
      },
      toUser(uid) {
        uid = this.userId
        if (uid !== 0 && uid !== this.$store.state.userId) {
          this.$store.commit('updateUserId', uid)
        }
        if (this.$route.path === '/user') {
          this.$router.push('/home')
          setTimeout(() => {
            this.$router.push('/user').then(err => {
              console.log(err);
            })
          }, 350)
        } else {
          this.$router.push('/user').then(err => {
            console.log(err);
          })
        }
      },
      toHome() {
        this.$router.push('/')
      },
      logout() {
        this.userId = 0
        this.userName = ''
        this.time = 3
        this.$store.commit('updateUserId', this.userId)
        this.$store.commit('updateUserName', this.userName)
        this.toHome()
      },
      swiperLeft() {
        let cPath = this.$route.path
        let routeCINdex = this.routes.indexOf(cPath)
        routeCINdex--
        if (routeCINdex < 0) {
          routeCINdex = this.routes.length - 1
        }
        this.$router.push(this.routes[routeCINdex])
      },
      swiperRight() {
        let cPath = this.$route.path
        let routeCINdex = this.routes.indexOf(cPath)
        routeCINdex++
        if (routeCINdex > this.routes.length - 1) {
          routeCINdex = 0
        }
        this.$router.push(this.routes[routeCINdex])
      },
      contentScroll(position) {
        this.showBackTop = (-position.y) > 400
      },
      backTop() {
        this.$refs.scroll.scrollTo(0, 30, 400)
      },
      beforeRouteUpdate(to, from, next) {
        // 在当前路由改变，但是该组件被复用时调用
        // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
        // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
        // 可以访问组件实例 `this`
        console.log(this)
        next()
      },
      loadMore() {
        switch (this.$route.path) {
          case '/comment': {
            this.$bus.$emit('loadMoreComments')
            break;
          }
          case '/hotDetail': {
            this.$bus.$emit('loadMoreHotDetails')
            break;
          }
        }
        const refresh = debounce(this.$refs.scroll.refresh, 500)
        refresh()
        this.$refs.scroll.finishPullUp()
      },
      hiddenAlert() {
        this.alertFlag1 = false
        this.alertFlag2 = false
      }
    }
  }
</script>

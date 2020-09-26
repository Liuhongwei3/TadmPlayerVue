<template>
  <div id="app">
    <nav-bar />
    <v-touch @swipeleft="toLeft" @swiperight="toRight">
      <div class="center">
        <div class="home">
          <Play />
        </div>
        <vertical-scroll
          class="content"
          ref="scroll"
          :probe-type="3"
          :pull-up-load="true"
          @scroll="contentScroll"
          @pullingUp="loadMore"
        >
          <div>
            <transition name="fade">
              <div>
                <keep-alive>
                  <router-view v-if="$route.meta.keepAlive" @toTop="backTop" />
                </keep-alive>
                <router-view v-if="!$route.meta.keepAlive" @toTop="backTop" />
              </div>
            </transition>
            <keep-alive>
              <About />
            </keep-alive>
          </div>
        </vertical-scroll>
      </div>
    </v-touch>
    <back-top class="backTop" @backTop="backTop" v-show="showBackTop">
      <i class="fa fa-arrow-up fa-2x" aria-hidden="true"></i>
    </back-top>
  </div>
</template>

<script>
import "@/css/App.css";

import { debounce } from "@/utils";

import NavBar from "@/components/common/Nav-bar/NavBar";
import Play from "./views/Play";
import About from "@/views/About";
import VerticalScroll from "@/components/common/scroll/VerticalScroll";
import BackTop from "@/components/common/backTop/BackTop";

export default {
  components: {
    Play,
    BackTop,
    About,
    NavBar,
    VerticalScroll,
  },
  data() {
    return {
      showBackTop: false,
      routes: [
        "/",
        "/top",
        "/hotDetail",
        "/search",
        "/singer",
        "/user",
        "/detail",
        "comment",
      ],
    };
  },
  mounted() {
    let msg = `%c^-^    ^-^    ^-^    ^-^    ^-^    ^-^\n
    %cWelcome to Tadm-Player-Vue!\n
    %cthis is my personal player by Tadm with vue-buckt & Ele-UI.\n
    If you think well,thanks to star ~\n
    %cGithub: https://github.com/Liuhongwei3`;
    console.info(msg, "color:green", "color:blue", "", "color:orange");
  },
  methods: {
    contentScroll(position) {
      //  监听 scroll 达到一定位置显示回到顶部按钮
      this.showBackTop = -position.y > 300;
    },
    backTop() {
      this.$refs.scroll.scrollTo(0, 10, 400);
    },
    loadMore: debounce(function() {
      switch (this.$route.path) {
        case "/comment": {
          this.$bus.$emit("loadMoreComments");
          break;
        }
        case "/hotDetail": {
          this.$bus.$emit("loadMoreHotDetails");
          break;
        }
      }
      // 上面数据请求后页面会发生变化，就需要我们重新计算保证后续正常滚动
      const refresh = debounce(this.$refs.scroll.refresh, 500);
      refresh();
      // 详见 scroll 组件的注释
      this.$refs.scroll.finishPullUp();
    }, 1000),
    findRouteIndex() {
      return this.routes.findIndex((item) => item === this.$route.path);
    },
    toLeft() {
      let route = this.findRouteIndex();
      if (route === 0) {
        route = this.routes.length;
      }
      if (route === -1) {
        route = this.routes.length - 1;
      }
      this.$router.push(this.routes[route - 1]);
    },
    toRight() {
      let route = this.findRouteIndex();
      if (route > this.routes.length - 1) {
        route = 0;
      }
      this.$router.push(this.routes[route + 1]);
    },
  },
};
</script>

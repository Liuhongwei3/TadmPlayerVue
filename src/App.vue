<template>
  <div id="app">
    <nav-bar />
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
        <transition name="fade">
          <div>
            <keep-alive>
              <router-view v-if="$route.meta.keepAlive" @to-top="backTop" />
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive" @to-top="backTop" />
          </div>
        </transition>
        <keep-alive>
          <About />
        </keep-alive>
      </vertical-scroll>
    </div>
    <back-top class="backTop" @backTop="backTop" v-show="showBackTop" />
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
  },
};
</script>

<template>
  <div id="app">
    <div id="app-bg" :style="backImg"></div>
    <el-tag class="top-info">Welcome to Tadm-Play-Vue ^-^</el-tag>
    <nav-bar></nav-bar>
    <div class="center">
      <vertical-scroll
        class="content"
        ref="scroll"
        :probe-type="3"
        :listen-scroll="true"
        :pull-up-load="true"
        @scroll="contentScroll"
        @pullingUp="loadMore"
      >
        <transition name="fade">
          <div>
            <keep-alive>
              <router-view @toTop="backTop" />
            </keep-alive>
            <el-divider></el-divider>
            <keep-alive>
              <About />
            </keep-alive>
          </div>
        </transition>
      </vertical-scroll>
      <div class="home">
        <Play />
      </div>
    </div>
    <back-top class="backTop" @backTop="backTop" v-show="showBackTop" />
  </div>
</template>

<script>
import "@/css/App.css";
import "@/css/element.css";

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
  computed: {
    backImg() {
      return {
        backgroundImage: "url(" + this.$store.state.imgs + ")",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundColor: "#949597",
      };
    },
    isPc: {
      get() {
        return this.$store.state.isPc;
      },
      set(val) {
        this.$store.commit("updateIsPc", val);
      },
    },
  },
  mounted() {
    let msg = `%c^-^    ^-^    ^-^    ^-^    ^-^    ^-^\n
    %cWelcome to Tadm-Player-Vue!\n
    %cthis is my personal player by Tadm with vue-buckt & Ele-UI.\n
    If you think well,thanks to star ~\n
    %cGithub: https://github.com/Liuhongwei3`;
    console.info(msg, "color:green", "color:blue", "", "color:orange");

    this.isPc = document.documentElement.clientWidth >= 768;

    window.addEventListener("resize", () => {
      this.isPc = document.documentElement.clientWidth >= 768;
    });

    this.$bus.$on("refresh", () => {
      this.$refs.scroll.refresh();
    });
    this.$bus.$on("toTop", () => {
      this.backTop();
    });
  },
  watch: {
    $route(to, from) {
      this.backTop();
      this.$nextTick(() => this.$refs.scroll.refresh());
      // 确保加载慢的数据也能进行重新计算
      setTimeout(() => {
        this.$refs.scroll.refresh();
      }, 1000);
    },
  },
  methods: {
    contentScroll(position) {
      //  监听 scroll 达到一定位置显示回到顶部按钮
      this.showBackTop = -position.y > 300;
    },
    backTop() {
      this.$refs.scroll.scrollTo(0, 0, 500);
    },
    loadMore: debounce(function () {
      switch (this.$route.path) {
        case "/comment": {
          this.$bus.$emit("loadMoreSongComments");
          break;
        }
        case "/detail": {
          this.$bus.$emit("loadMoreDetail");
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

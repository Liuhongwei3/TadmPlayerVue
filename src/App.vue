<template>
  <div id="app">
    <nav-bar />
    <div class="center">
      <div class="home">
        <Play />
      </div>
      <scroll
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
              <router-view />
              <About />
            </div>
          </transition>
        </div>
      </scroll>
    </div>
    <back-top class="backTop" @backTop="backTop" v-show="showBackTop">
      <i class="fa fa-arrow-up fa-2x" aria-hidden="true"></i>
    </back-top>
  </div>
</template>

<script>
import NavBar from "@/components/common/Nav-bar/NavBar";
import { debounce } from "@/utils";
import "@/css/App.css";
import Play from "./views/Play";
import About from "@/views/About";
import Scroll from "@/components/common/scroll/Scroll";
import BackTop from "@/components/common/backTop/BackTop";

export default {
  components: { Play, BackTop, About, NavBar, Scroll },
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
      this.showBackTop = -position.y > 300;
    },
    backTop() {
      this.$refs.scroll.scrollTo(0, 30, 400);
    },
    loadMore() {
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
      const refresh = debounce(this.$refs.scroll.refresh, 500);
      refresh();
      this.$refs.scroll.finishPullUp();
    },
  },
};
</script>

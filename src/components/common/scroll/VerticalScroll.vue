<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
// https://better-scroll.github.io/docs/zh-CN/
import BScroll from "better-scroll";
import { debounce, throttle } from "@/utils";

export default {
  name: "VerticalScroll",
  data() {
    return {
      scroll: null,
    };
  },
  props: {
    probeType: {
      type: Number,
      default: 3,
    },
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    listenScroll: {
      type: Boolean,
      default: false,
    },
    pullUpLoad: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    setTimeout(this.__initScroll, 500);
    window.addEventListener("resize", this.refresh);
  },
  methods: {
    __initScroll() {
      // 1.初始化BScroll对象
      if (!this.$refs.wrapper) return;
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: true,
        dblclick: true,
        stopPropagation: true,
        mouseWheel: true,
        pullUpLoad: this.pullUpLoad,
      });

      // 2.将监听事件回调
      this.listenScroll &&
        this.scroll.on(
          "scroll",
          throttle((position) => {
            this.$emit("scroll", position);
          })
        );

      // 3.监听上拉到底部
      this.pullUpLoad &&
        this.scroll.on(
          "pullingUp",
          this.pullUpLoad &&
            debounce(() => {
              this.$emit("pullingUp");
            })
        );
    },
    refresh() {
      //  重新计算 BetterScroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常
      this.scroll && this.scroll.refresh && this.scroll.refresh();
    },
    finishPullUp() {
      // finishPullUp: 这个类似控制一个开关，比如在触发 pullingUp 事件的时候，插件肯定会把一个开关给关掉，防止用户重复上拉
      // 在数据加载完成以后，需要执行 finishPullUp() 把开关打开，以便下次可以继续执行上拉刷新
      this.scroll && this.scroll.finishPullUp && this.scroll.finishPullUp();
    },
    scrollTo(x, y, time) {
      this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x, y, time);
    },
  },
  beforeDestroy() {
    this.scroll.destroy();
  },
};
</script>

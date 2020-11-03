<template>
  <div class="h-wrapper" ref="hWrapper">
    <slot></slot>
  </div>
</template>

<script>
// https://better-scroll.github.io/docs/zh-CN/
import BScroll from "better-scroll";
import { throttle } from "@/utils";

export default {
  name: "HorizontalScroll",
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
  },
  mounted() {
    setTimeout(this.__initScroll, 100);
    window.addEventListener("resize", this.refresh);
  },
  methods: {
    __initScroll() {
      // 1.初始化BScroll对象
      if (!this.$refs.hWrapper) return;
      this.scroll = new BScroll(this.$refs.hWrapper, {
        probeType: this.probeType,
        click: true,
        scrollX: true,
        // 阻止冒泡，当页面中存在两个及以上 BS 时会造成两次点击事件
        stopPropagation: true,
      });

      // 2.将监听事件回调
      this.scroll.on(
        "scroll",
        throttle((position) => {
          this.$emit("scroll", position);
        })
      );
    },
    refresh() {
      //  重新计算 BetterScroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常
      this.scroll && this.scroll.refresh && this.scroll.refresh();
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

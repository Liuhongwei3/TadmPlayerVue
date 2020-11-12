<template>
  <div class="slide-wrapper">
    <div class="slide-content">
      <div class="slide-page">22</div>
      <div class="slide-page">222333</div>
      <div class="slide-page">3rr3wef</div>
      <div class="slide-page">fsddfs</div>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  data() {
    return {
      nums: 4,
      currentPageIndex: 0,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.slide = new BScroll(this.$refs.slide, {
        scrollX: true,
        scrollY: false,
        slide: true,
        useTransition: true,
        momentum: false,
        bounce: false,
        stopPropagation: true,
        probeType: 2,
      });
      this.slide.on("scrollEnd", this._onScrollEnd);

      this.slide.on("slideWillChange", (page) => {
        this.currentPageIndex = page.pageX;
      });
    },
    _onScrollEnd() {
      console.log(this.slide.getCurrentPage());
    },
    nextPage() {
      this.slide.next();
    },
    prePage() {
      this.slide.prev();
    },
  },
  beforeDestroy() {
    this.slide.destroy();
  },
};
</script>
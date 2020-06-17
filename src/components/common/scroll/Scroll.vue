<!--
  - https://liuhongwei3.github.io Inc.
  - Name: Scroll.vue
  - Date: 2020/2/9 上午11:21
  - Author: Tadm
  - Copyright (c) 2020 All Rights Reserved.
  -->

<template>
  <div class="wrapper" ref="wrapper">
	<!--  <div class="content">-->
	<slot></slot>
	<!--  </div>-->
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import Detail from "../../../views/detail";

  export default {
    name: "Scroll",
    components: {Detail},
    data() {
      return {
        scroll: null
      }
    },
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      data: {
        type: Array,
        default: () => {
          return []
        }
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    created() {
    },
    mounted() {
      // 默认情况下BScroll是不可以实时的监听滚动位置
      // probe 侦测
      // 0,1都是不侦测实时的位置
      // 2: 在手指滚动的过程中侦测, 手指离开后的惯性滚动过程中不侦测.
      // 3: 只要是滚动, 都侦测.
      // this.scroll = new BScroll(this.$refs.wrapper)
      // this.$nextTick(() => {
      //   this.scroll = new BScroll(this.$refs.wrapper, {
      //     probeType: 2,
      //     click: true,
      //     mouseWheel: true
      //   });
      // })
      setTimeout(this.__initScroll, 20)
    },
	methods: {
      __initScroll() {
        // 1.初始化BScroll对象
        if (!this.$refs.wrapper) return
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: true,
          mouseWheel: true,
          pullUpLoad: this.pullUpLoad
        })

        // 2.将监听事件回调
        this.scroll.on('scroll', position => {
          this.$emit('scroll', position)
        })

        // 3.监听上拉到底部
        this.scroll.on('pullingUp', () => {
          this.$emit('pullingUp')
        })
      },
      refresh() {
        this.scroll && this.scroll.refresh && this.scroll.refresh()
      },
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp && this.scroll.finishPullUp()
      },
      scrollTo(x, y, time) {
        this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x, y, time)
      }
	}
  }
</script>

<style scoped>
  .wrapper {
	/*position: relative;*/
	/*height: 50vh;*/
  }

  .content {
	/*position: absolute;*/
	/*top: 44px;*/
	/*bottom: 49px;*/
	/*left: 0;*/
	/*right: 0;*/
  }
</style>

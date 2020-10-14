<template>
  <div class="about">
    <code>Welcome to use Tadm-Player by Vue~</code>
    <div>
      本站仅作学习用途，不存储任何媒体资源，音乐版权均归版权方专有，谢谢合作！！！
    </div>
    <div>
      &copy;&nbsp;&nbsp;2020&nbsp;<span v-if="year !== 2020"
        >-&nbsp;&nbsp;{{ year }}&nbsp;&nbsp;</span
      >
      <i class="fa fa-heart" aria-hidden="true" id="heart"></i>
      &nbsp;&nbsp;
      <el-tooltip placement="bottom" content="去他的博客看看">
        <el-link type="primary" href="https://liuhongwei3.github.io"
          >Tadm</el-link
        > </el-tooltip
      >&nbsp;&nbsp;
      <el-tooltip placement="right" content="去他的 Github 看看">
        <el-link
          type="success"
          href="https://github.com/Liuhongwei3/TadmPlayerVue"
        >
          <i class="fa fa-github fa-2x" aria-hidden="true"></i>
        </el-link>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: "About",
  data() {
    return {
      year: new Date().getFullYear(),
    };
  },
};
</script>

<style scoped>
div {
  margin: 10px;
}

@keyframes heartAnimate {
  0%,
  100% {
    transform: scale(1);
  }
  10%,
  30% {
    transform: scale(0.9);
  }
  20%,
  40%,
  60%,
  80% {
    transform: scale(1.1);
  }
  50%,
  70% {
    transform: scale(1.1);
  }
}

#heart {
  color: #f13131;
  animation: heartAnimate 1s linear infinite;
}

.fa-2x {
  font-size: 1.3em;
}

.about {
  margin: 25px 0;
  padding-bottom: 5px;
}
</style>

<template>
  <div class="about">
    <p>&copy;&nbsp;&nbsp;2020&nbsp;-&nbsp;&nbsp;{{ year }}&nbsp;&nbsp;
      <i class="fa fa-heart" aria-hidden="true" id="heart"></i>
      &nbsp;&nbsp;<el-link type="primary" href="https://liuhongwei3.github.io">Tadm</el-link>&nbsp;&nbsp;
      <el-link type="success" href="https://github.com/Liuhongwei3/TadmPlayer">
        <i class="fa fa-github fa-2x" aria-hidden="true"></i>
      </el-link>
    </p>
  </div>
</template>

<script>
  export default {
    name: "About",
    data() {
      return {
        year: new Date().getFullYear()
      }
    }
  }
</script>

<style scoped>
  @keyframes heartAnimate {
    0%, 100% {
      transform: scale(1);
    }
    10%, 30% {
      transform: scale(0.9);
    }
    20%, 40%, 60%, 80% {
      transform: scale(1.1);
    }
    50%, 70% {
      transform: scale(1.1);
    }
  }

  #heart {
    color: #f13131;
    animation: heartAnimate 1s infinite;
  }

  .fa-2x {
    font-size: 1.3em;
  }

  .about {
    margin: 25px 0;
    padding-bottom: 5px;
  }
</style>

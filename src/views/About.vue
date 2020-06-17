<!--
  - https://liuhongwei3.github.io Inc.
  - Name: About.vue
  - Date: 2020/1/30 上午9:46
  - Author: Tadm
  - Copyright (c) 2020 All Rights Reserved.
  -->

<template>
  <div class="about">
	<h5>Welcome to Tadm-Player~</h5>
	<p>&copy;&nbsp;&nbsp;2019&nbsp;--&nbsp;&nbsp;{{ year }}&nbsp;&nbsp;<i class="fa fa-heart" aria-hidden="true" id="myheart"></i>
	  &nbsp;&nbsp;<a href="https://liuhongwei3.github.io">Tadm</a>&nbsp;&nbsp;
	  <a href="https://github.com/Liuhongwei3/TadmPlayer">
		<i class="fa fa-github fa-2x" aria-hidden="true"></i>
	  </a>
	</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        year: 0
      }
    },
    created() {
      this.year = new Date().getFullYear()
    },
    methods: {}
  }
</script>

<style scoped>
  @keyframes heartAnimate {
	0%, 100% {
	  transform: scale(1);
	}
	/*0%,100%时保持图形的原大小*/
	10%, 30% {
	  transform: scale(0.9);
	}
	/*10%,30%时图形缩小成0.9倍*/
	20%, 40%, 60%, 80% {
	  transform: scale(1.1);
	}
	/*20%,40%,60%,80%时图形扩大成1.1倍*/
	50%, 70% {
	  transform: scale(1.1);
	}
	/*50%,70%时图形扩大成1.1倍*/
  }

  #myheart {
	color: red;
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

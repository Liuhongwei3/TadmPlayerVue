<!--
  - https://liuhongwei3.github.io Inc.
  - Name: top.vue
  - Date: 2020/1/30 上午10:01
  - Author: Tadm
  - Copyright (c) 2020 All Rights Reserved.
  -->

<template>
  <div id="top">
	<div v-for="(item,index) in toplist" :key="index">
	  <img @click="toplistDetail(item.id)" :src="item.coverImgUrl">
	</div>
  </div>
</template>

<script>
  import {toplist} from "../network/Top";

  export default {
    name: "top",
    data() {
      return {
        toplist: [],
        listIds: [],
        musicUrls: []
      }
    },
    created() {
      toplist().then(res => {
        if (res.data.code === 200) {
          this.toplist = res.data.list
        } else {
          console.log('There is some errors~')
        }
      })
    },
    // beforeRouteEnter (to, from, next) {
    //   // console.log(this);	// undefined
    //   next(vm=>{
    //     console.log(vm)		//	当前实例
	//   })
    // },
    methods: {
      toplistDetail(id) {
        this.$store.commit('updatePlaylistCurrentId', id)
        this.$router.push('/detail')
      }
    }
  }
</script>

<style scoped>
  #top {
	flex: 1;
	justify-content: space-around;
  }

  img {
	margin: 15px;
  }

  div {
	display: flex;
	flex-wrap: wrap;
  }

  @media screen and (max-width: 768px) {
	img {
	  margin: 10px 0;
	}
  }
</style>

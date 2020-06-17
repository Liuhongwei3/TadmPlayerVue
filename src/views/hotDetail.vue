<!--
  - https://liuhongwei3.github.io Inc.
  - Name: hotDetail.vue
  - Date: 2020/4/3 下午8:44
  - Author: Tadm
  - Copyright (c) 2020 All Rights Reserved.
  -->

<template>
  <div id="hotDetail">
	<div class="main" :title="item.name" v-for="item in hotDetailLists" @click="updateDetailId(item.id)">
	  <div class="authorPlayCount">
		<div class="top">
		  <i class="fa fa-headphones" aria-hidden="true"></i> {{item.playCount | roundW}}
		</div>
		<div class="bottom">By
		  <span title="点击用户名进入详情" @click="updateUserId(item.creator.userId)">{{item.creator.nickname}}</span>
		</div>
	  </div>
	  <img v-lazy="item.coverImgUrl" :key="item.coverImgUrl">
	  <p class="name">{{ item.name }}</p>
	</div>
  </div>
</template>

<script>
  import {hotDetails} from "../network/Top";

  export default {
    name: "hotDetail",
    data() {
      return {
        hotDetailLists: [],
        limit: 24
      }
    },
    created() {
      this.requestHotDetails(this.limit)
    },
    mounted() {
      this.$bus.$on('loadMoreHotDetails', () => {
        if (this.limit <= 100) {
          this.limit += 24
          this.requestHotDetails(this.limit)
        }
      })
    },
    methods: {
      requestHotDetails(limit) {
        hotDetails(limit).then(res => {
          if (res.data.code === 200) {
            this.hotDetailLists = res.data.playlists
          } else {
            console.log('There is some errors~')
          }
        })
      },
      updateDetailId(id) {
        this.$store.commit('updatePlaylistCurrentId', id)
        this.$router.push('/detail')
      },
      updateUserId(uid) {
        this.$store.commit('updateUserId', uid)
        this.$router.push('/user').then(err => {
          console.log(err);
        })
      }
    },
    beforeDestroy() {
      this.$bus.$off("loadMoreHotDetails");  //当这个组件销毁的时候bus也跟着一起销毁
    }
  }
</script>

<style scoped>
  #hotDetail {
	display: flex;
	flex: 1;
	flex-wrap: wrap;
	justify-content: space-around;
  }

  .main {
	position: relative;
	text-align: center;
  }

  .main:hover {
	color: #ff6c80;
	cursor: pointer;
  }

  .top, .bottom {
	position: absolute;
	height: 25px;
	color: #e6e6e6;
	font-size: 12px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
  }

  @media screen and (max-width: 768px) {
	.top, .bottom {
	  width: 80px;
	}
  }
</style>

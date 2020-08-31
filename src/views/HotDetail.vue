<template>
  <div>
    <el-tag type="danger">热门歌单</el-tag>
    <el-tag type="info">放松心情</el-tag>
    <el-tag type="success">动感节奏</el-tag>
    <el-tag type="primary">轻松纯音乐</el-tag>
    <div id="hotDetail">
      <div class="main" :title="item.name" v-for="item in hotDetailLists" @click="updateDetailId(item.id)">
        <div class="authorPlayCount">
          <div class="top">
            <i class="fa fa-headphones" aria-hidden="true"></i> {{item.playCount | roundW}}
          </div>
          <div class="bottom">By
            <span>{{item.creator.nickname}}</span>
          </div>
        </div>
        <img v-lazy="item.coverImgUrl" :key="item.coverImgUrl">
        <p class="name">{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {hotDetails} from "@/network/Request";

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
        this.$store.commit('updateDetailId', id)
        this.$router.push('/detail')
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
    margin: 10px 0;
  }

  .main:hover {
    color: #ff6c80;
    cursor: pointer;
  }

  .top {
    top: 5px;
    right: 25px;
    z-index: 9;
  }

  .bottom {
    bottom: 36px;
    left: 30px;
    z-index: 9;
  }

  @media screen and (max-width: 768px) {
    .top{
      top: 0;
      right: 5px;
    }

    img {
      margin: 5px;
    }
  }
</style>

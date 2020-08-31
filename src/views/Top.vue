<template>
  <div>
    <el-tag type="danger">热门排行榜</el-tag>
    <el-tag type="danger">网易云音乐</el-tag>
    <div id="top" class="main">
      <div v-for="(item,index) in topList" :key="index">
        <img @click="updateDetail(item.id)" :src="item.coverImgUrl">
      </div>
    </div>
  </div>
</template>

<script>
  import {toplist} from "../network/Request";

  export default {
    name: "Top",
    data() {
      return {
        topList: [],
      }
    },
    created() {
      toplist().then(res => {
        if (res.data.code === 200) {
          this.topList = res.data.list;
        }
      })
    },
    methods: {
      updateDetail(id) {
        this.$store.commit('updateDetailId', id);
        this.$router.push('/detail');
      }
    }
  }
</script>

<style scoped>
  #top {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  @media screen and (max-width: 768px) {
    img {
      margin: 10px 5px;
    }
  }
</style>
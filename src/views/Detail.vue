<template>
  <div>
    <div class="title">
      <div>
        <el-tag class="author" type="info">{{this.detailName}}</el-tag>&nbsp;&nbsp;
        <el-tag type="success" title="点击查看用户详情" @click="updateUserId()">{{this.detailAuthorName}}</el-tag>
      </div>
    </div>
    <el-card class="box-card" v-if="description">{{ this.description }}</el-card>
    <div id="detail">
      <div class="items main" v-for="(item,index) in detailList" :key="index" @click="updateSongId(item.id)">
        <img v-lazy="item.al.picUrl" :title="`${item.name}---${item.ar[0].name}`" alt="img">
        <p class="name">{{ item.name }}---<a title="点击歌手名查看歌手" @click.prevent="searchPlayer(item.ar[0].name)">{{
          item.ar[0].name }}</a></p>
<!--        <img class="play" src="@/assets/play_icon.png" alt="">-->
      </div>
    </div>
  </div>
</template>

<script>
  import {playlistdetail, musicCover} from "@/network/Request";

  export default {
    name: "Detail",
    data() {
      return {
        detailName: "",
        detailAuthorId: 0,
        detailAuthorName: "",
        description: "",
        detailList: [],
        playlistIds: [],
        imgUrls: []
      }
    },
    created() {
      let pdlId = this.$store.state.detailId
      this.requestPlaylistDetail(pdlId)
    },
    methods: {
      async requestPlaylistDetail(pdlId) {
        playlistdetail(pdlId).then(res => {
          let {data: {playlist}} = res;
          this.detailName = playlist.name;
          this.detailAuthorId = playlist.creator.userId;
          this.detailAuthorName = playlist.creator.nickname;
          this.description = playlist.description;
          let temp = playlist.trackIds;
          let songIds = '';
          temp.forEach(item => {
            songIds += item.id + ",";
          });
          let last = songIds.length - 1;
          songIds = songIds.substring(0, last);
          musicCover(songIds).then(res => {
            let {data} = res;
            this.detailList = data.songs;
            for (let i = 0; i < this.detailList.length; i++) {
              this.playlistIds[i] = this.detailList[i].id;
              this.imgUrls[i] = this.detailList[i].al.picUrl;
            }
          });
        })
      },
      updateSongId(sid) {
        this.$store.commit('updateSongId', sid);
        this.$store.commit('updatePlaylistIds', this.playlistIds);
      },
      searchPlayer(player) {
        this.$store.commit('updateSingerName', player);
        this.$router.push('/singer');
      },
      updateUserId() {
        this.$store.commit('updateUserId', this.detailAuthorId);
        this.$router.push('/user');
      }
    }
  }
</script>

<style scoped>
  .title {
    color: coral;
    text-align: center;
    margin-bottom: 10px;
    font-size: 16px;
  }

  .author {
    color: #ff2b2b;
  }

  #detail,.play {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .items {
    position: relative;
  }

  .play {
    width: 150px;
    height: 150px;
    position: absolute;
    top: 0;
    left: 5px;
    opacity: 0;
  }

  @media screen and (max-width: 768px) {
    .play {
      width: 100px;
      height: 100px;
    }

    img {
      margin: 5px;
    }
  }
</style>

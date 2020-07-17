<!--
  - https://liuhongwei3.github.io Inc.
  - Name: detail.vue
  - Date: 2020/1/30 下午11:15
  - Author: Tadm
  - Copyright (c) 2020 All Rights Reserved.
  -->

<template>
    <div>
        <div class="title">
            <div>
                <span>{{this.detailName}} By </span>
                <span title="点击查看用户详情" @click="updateUserId()" class="author">{{this.detailAuthor}}</span>
            </div>
        </div>
        <div class="description">{{ this.description }}</div>
        <div id="detail">
            <div class="items" v-for="item in detaillist" @click="songId(item.id)">
                <img v-lazy="item.al.picUrl" :key="item.al.picUrl" :title="`${item.name}---${item.ar[0].name}`">
                <p class="name">{{ item.name }}---<a title="点击歌手名查看歌手" @click.prevent="searchPlayer(item.ar[0].name)">{{
                    item.ar[0].name }}</a></p>
                <img class="play" src="../assets/play_icon.png" alt="">
            </div>
        </div>
    </div>
</template>

<script>
  import {musicCover, playlistdetail} from "../network/Top";

  export default {
    name: "detail",
    data() {
      return {
        pdlId: 0,
        detailAuthorId: 0,
        detailName: '',
        detailAuthor: '',
        detaillist: [],
        playlistIds: [],
        imgUrls: [],
        description: ''
      }
    },
    created() {
      let pdlId = this.$store.state.playlistCurrentId
      this.pdlId = pdlId
      this.requestPlaylistDetail(pdlId)
    },
    watch: {
      pdlId() {
        this.$store.commit('updatePlaylist', this.detaillist);
        this.$store.commit('updatePlaylistIds', this.playlistIds)
      },
    },
    methods: {
      async requestPlaylistDetail(pdlId) {
        playlistdetail(pdlId).then(res => {
          let data = res.data.playlist;
          this.detailName = data.name;
          this.detailAuthorId = data.creator.userId;
          this.detailAuthor = data.creator.nickname;
          this.description = data.description;
          if (!this.description) {
            this.description = '暂时还没有简介呢~';
          }
          let temp = data.trackIds;
          let songIds = '';
          temp.forEach(item => {
            songIds += item.id + ",";
          });
          let last = songIds.length - 1;
          songIds = songIds.substring(0, last);
          musicCover(songIds).then(res => {
            let {data} = res;
            this.detaillist = data.songs;
            for (let i = 0; i < this.detaillist.length; i++) {
              this.playlistIds[i] = this.detaillist[i].id;
              this.imgUrls[i] = this.detaillist[i].al.picUrl;
            }
          });
        })
      },
      songId(sid) {
        this.$store.commit('updateSongId', sid);
        this.playlistIds = this.$store.state.playlistIds;
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

    #detail {
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
        left: 0;
        opacity: 0;
    }
    @media screen and (max-width: 768px) {
        .play{
            width: 100px;
            height: 100px;
        }
    }
</style>

<template>
  <div>
    <el-tag type="success" @click="changeSongsFlag" v-if="this.singerName.length === 0">歌手热门歌曲</el-tag>
    <el-tag title="点击显示或隐藏详情" @click="changeSongsFlag" v-else>{{this.singerName}}</el-tag>
    <el-card shadow="hover" class="box-card" v-if="this.musiclist.length === 0">
      <div slot="header" class="clearfix">
        <span>Tips</span>
      </div>
      <no-result :result="musiclist"/>
      <span>点击上方歌手名或者索您喜欢的歌手即可查看！</span>
    </el-card>
    <div v-else>
      <el-card class="box-card" v-if="briefDesc">{{ this.briefDesc }}</el-card>
      <div id="singerSongs" v-show="this.songsFlag">
        <div class="items main" v-for="item in musiclist" :key="item.id" @click="songId(item.id)" :title="item.al.name">
          <div>
            <img v-lazy="item.al.picUrl" :key="item.al.picUrl">
            <p class="name">{{ item.al.name }}</p>
          </div>
        </div>
      </div>
    </div>
    <el-tag title="点击显示或隐藏详情" @click="changeSingerFlag">热门歌手排行榜</el-tag>
    <div id="singer" v-show="this.singerFlag">
      <div class="items main" v-for="item in hotSingers" :key="item.id">
        <img v-lazy="item.picUrl" :key="item.picUrl" title="点击查看歌手详情"
             @click.prevent="searchPlayer(item.id,item.name)">
        <p>{{ item.name }}</p>
      </div>
    </div>
  </div>

</template>

<script>
  import {hotSinger, searchSinger, singer} from "@/network/Request";
  import NoResult from "@/components/common/noResult/NoResult";

  export default {
    name: "Singer",
    components: {NoResult},
    data() {
      return {
        singerFlag: false,
        songsFlag: true,
        singerId: 0,
        singerName: '',
        briefDesc: '',
        hotSingers: [],
        musiclist: []
      }
    },
    created() {
      hotSinger().then(res => {
        this.hotSingers = res.data.artists
      })
      let name = this.$store.state.singerName
      name && searchSinger(name).then(res => {
        this.singerId = res.data.result.artists[0].id
        this.requestSinger(this.singerId)
      })
      if (this.singerId === 0) {
        this.singerFlag = true
        this.songsFlag = false
      }
    },
    computed: {},
    watch: {
      singerId(newValue) {
        if (newValue !== 0) {
          this.singerFlag = false
          this.songsFlag = true
          this.requestSinger(newValue)
        }
      }
    },
    methods: {
      requestSinger(sid) {
        singer(sid).then(res => {
          this.singerName = res.data.artist.name
          this.briefDesc = res.data.artist.briefDesc
          this.musiclist = res.data.hotSongs;
        })
      },
      songId(sid) {
        this.$store.commit('updateSongId', sid)
      },
      searchPlayer(id, name) {
        this.singerId = id
        this.$store.commit('updateSingerName', name)
        this.singerName = name
      },
      changeSingerFlag() {
        this.singerFlag = !this.singerFlag
      },
      changeSongsFlag() {
        this.songsFlag = !this.songsFlag
      }
    }
  }
</script>

<style scoped>
  #singer, #singerSongs {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  @media screen and (max-width: 768px) {
    img {
      margin: 5px;
    }
  }
</style>

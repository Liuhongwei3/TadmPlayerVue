<!--
  - https://liuhongwei3.github.io Inc.
  - Name: Singer.vue
  - Date: 2020/2/2 下午4:48
  - Author: Tadm
  - Copyright (c) 2020 All Rights Reserved.
  -->

<template>
  <div>
	<div class="title" @click="changeSongsFlag" v-if="this.singerName.length === 0">歌手热门歌曲</div>
	<div class="title" title="点击显示或隐藏详情" @click="changeSongsFlag" v-else>{{ this.singerName }} 的热门歌曲</div>
	<no-result :result="musiclist"></no-result>
	<div v-if="this.musiclist.length === 0">
	  Tips: 可以点击上方歌手名或者去搜索您喜欢的歌手哟！
	</div>
	<div v-else>
	  <span class="description">{{ this.briefDesc }}</span>
	  <div id="singerSongs" v-show="this.songsFlag">
		<div class="items" v-for="item in musiclist" :key="item.id" @click="songId(item.id)" :title="item.al.name">
		  <div>
			<img v-lazy="item.al.picUrl" :key="item.al.picUrl">
			<p class="name">{{ item.al.name }}</p>
		  </div>
		</div>
	  </div>
	</div>
	<div class="title" title="点击显示或隐藏详情" @click="changeSingerFlag">热门歌手排行榜</div>
	<div id="singer" v-show="this.singerFlag">
	  <div class="items" v-for="item in hotSingers" :key="item.id">
		<img v-lazy="item.picUrl" :key="item.picUrl" title="点击查看歌手详情"
			 @click.prevent="searchPlayer(item.id,item.name)">
		<p>{{ item.name }}</p>
	  </div>
	</div>
  </div>

</template>

<script>
  import {hotSinger, searchSinger, singer} from "../network/Top";
  import NoResult from "../components/common/noResult/NoResult";

  export default {
    name: "Singer",
    components: {NoResult},
    data() {
      return {
        singerFlag: true,
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

  .title {
	color: coral;
	text-align: center;
	margin-bottom: 10px;
	font-size: 18px;
  }
</style>

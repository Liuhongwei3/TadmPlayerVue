<template>
  <div id="search">
    <input type="text" class="form-control searchInput" placeholder="Please Input your search content~"
           v-model.lazy="keyword">
    <div class="choose">
      <div class="form-check" @click="searchSongs">
        <input class="form-check-input" type="radio" name="exampleRadios" id="Radios1" value="option1" checked>
        <label class="form-check-label" for="Radios1">
          歌曲
        </label>
      </div>
      <div class="form-check" @click="searchLyrics">
        <input class="form-check-input" type="radio" name="exampleRadios" id="Radios2" value="option2">
        <label class="form-check-label" for="Radios2">
          歌词
        </label>
      </div>
      <div class="form-check" @click="searchDetails">
        <input class="form-check-input" type="radio" name="exampleRadios" id="Radios3" value="option2">
        <label class="form-check-label" for="Radios3">
          歌单
        </label>
      </div>
      <div class="form-check" @click="searchSingers">
        <input class="form-check-input" type="radio" name="exampleRadios" id="Radios4" value="option2">
        <label class="form-check-label" for="Radios4">
          歌手
        </label>
      </div>
      <div class="form-check" @click="searchUsers">
        <input class="form-check-input" type="radio" name="exampleRadios" id="Radios5" value="option2">
        <label class="form-check-label" for="Radios5">
          用户
        </label>
      </div>
    </div>

    <div id="hotSearch">
      <span id="hotSearchResults" v-for="item in hotSearchResults">
		    <el-tag type="success" @click.prevent="updateKeyword(item.first)">{{ item.first }}</el-tag>
	    </span>
    </div>
    <div id="searchResult" v-show="showSongs">
      <no-result :result="searchResults"></no-result>
      <div class="main" v-for="item in searchResults">
        <img v-lazy="item.rUrl" :key="item.rUrl" @click="songId(item.id)">
        <p class="name">{{ item.name }}---{{ item.artists[0].name }}</p>
      </div>
    </div>
    <div id="searchLyrics" v-show="showLyrics">
      <no-result :result="searchLyricsResults"></no-result>
      <div class="main" v-for="item in searchLyricsResults">
        <img v-lazy="item.artists[0].img1v1Url" :key="item.artists[0].img1v1Url" @click="songId(item.id)">
        <p class="name">{{ item.name }}</p>
      </div>
    </div>
    <div id="searchDetails" v-show="showDetails">
      <no-result :result="searchDetailsResults"></no-result>
      <div class="main" v-for="item in searchDetailsResults">
        <img v-lazy="item.coverImgUrl" :key="item.coverImgUrl" @click="updatePlaylist(item.id)">
        <p class="name">{{ item.name }}</p>
      </div>
    </div>
    <div id="searchSingers" v-show="showSingers">
      <no-result :result="searchSingersResults"></no-result>
      <div class="main" v-for="(item) in searchSingersResults">
        <img v-lazy="item.picUrl" :key="item.picUrl" @click="updateSingerName(item.name)">
        <p class="name">{{ item.name }}</p>
      </div>
    </div>
    <div id="searchUser" v-show="showUsers">
      <no-result :result="searchUserResults"></no-result>
      <div class="main" v-for="item in searchUserResults">
        <img v-lazy="item.avatarUrl" :key="item.avatarUrl" @click="updateUserId(item.userId)">
        <p class="name">{{ item.nickname }}</p>
      </div>
    </div>
  </div>

</template>

<script>
  import {hotSearch, musicCover, searchMusic, search} from "@/network/Request";
  import NoResult from "@/components/common/noResult/NoResult";

  export default {
    name: "search",
    components: {NoResult},
    data() {
      return {
        showSongs: true,
        showLyrics: false,
        showDetails: false,
        showSingers: false,
        showUsers: false,
        keyword: '',
        searchResults: [],
        hotSearchResults: [],
        searchDetailsResults: [],
        searchLyricsResults: [],
        searchSingersResults: [],
        searchUserResults: []
      }
    },
    created() {
      hotSearch().then(res => {
        this.hotSearchResults = res.data.result.hots
      })
    },
    watch: {
      keyword(newValue) {
        newValue && this.showSongs && this.searchSongs()
      }
    },
    methods: {
      songId(sid) {
        this.$store.commit('updateSongId', sid)
      },
      updateKeyword(keyword) {
        this.keyword = keyword
      },
      searchSongs() {
        this.showLyrics = false
        this.showDetails = false
        this.showSingers = false
        this.showUsers = false
        this.showSongs = true
        this.keyword && searchMusic(this.keyword).then(res => {
          this.searchResults = res.data.result.songs
          for (let i = 0; i < this.searchResults.length; i++) {
            musicCover(this.searchResults[i].id).then(res => {
              if (res.data.code === 200) {
                let database = res.data.songs[0]
                this.searchResults[i].rUrl = database.al.picUrl
              }
            })
          }
        })
      },
      searchLyrics() {
        this.showSongs = false
        this.showLyrics = true
        this.showDetails = false
        this.showUsers = false
        this.showSingers = false
        this.keyword && search(this.keyword, 1006).then(res => {
          this.searchLyricsResults = res.data.result.songs
        })
      },
      searchDetails() {
        this.showSongs = false
        this.showLyrics = false
        this.showDetails = true
        this.showUsers = false
        this.showSingers = false
        this.keyword && search(this.keyword, 1000).then(res => {
          this.searchDetailsResults = res.data.result.playlists
        })
      },
      searchSingers() {
        this.showSongs = false
        this.showLyrics = false
        this.showDetails = false
        this.showUsers = false
        this.showSingers = true
        this.keyword && search(this.keyword, 100).then(res => {
          this.searchSingersResults = res.data.result.artists
        })
      },
      searchUsers() {
        this.showSongs = false
        this.showLyrics = false
        this.showDetails = false
        this.showSingers = false
        this.showUsers = true
        this.keyword && search(this.keyword, 1002).then(res => {
          this.searchUserResults = res.data.result.userprofiles
        })
      },
      updatePlaylist(id) {
        this.$store.commit('updatePlaylistCurrentId', id)
        this.$router.push('/detail')
      },
      updateSingerName(name) {
        this.$store.commit('updateSingerName', name)
        this.$router.push('/singer')
      },
      updateUserId(uid) {
        this.$store.commit('updateUserId', uid)
        this.showCommentsFlag = !this.showCommentsFlag
        if (this.$route.path === '/user') {
          this.$router.push('/home')
          setTimeout(() => {
            this.$router.push('/user').then(err => {
              console.log(err);
            })
          }, 350)
        } else {
          this.$router.push('/user').then(err => {
            console.log(err);
          })
        }
      }
    }
  }
</script>

<style scoped>
  #searchResult, #searchSingers, #searchLyrics, #searchDetails, #searchUser {
    margin: 15px;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    padding: 0 15px;
  }

  #hotSearchResults {
    margin: 0 5px;
    color: #ff572b;
  }

  #hotSearchResults:hover {
    cursor: pointer;
  }

  .main {
    flex: 1;
  }

  .main:hover {
    color: #ff6c80;
  }

  .searchInput {
    width: 50%;
    margin: 0 auto;
  }

  .choose {
    display: inline-flex;
    margin: 10px;
    color: #ff0057;
  }

  .form-check {
    margin-left: 10px;
  }

  @media screen and (max-width: 768px) {
    #searchResult {
      margin: 0 auto;
      padding: 0;
    }

    img {
      margin: 5px;
    }

    .searchInput {
      width: 75%;
    }
  }
</style>

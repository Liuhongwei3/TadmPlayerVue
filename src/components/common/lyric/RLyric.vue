<!--
  - https://liuhongwei3.github.io Inc.
  - Name: RLyric.vue
  - Date: 2020/2/11 下午12:58
  - Author: Tadm
  - Copyright (c) 2020 All Rights Reserved.
  -->

<template>
  <div>
    <div class="topLyric" ref="topLyric"></div>
    <div class="rightL" ref="musicLyric">
      <div :style="lyricTop">
        <div class="lyrics" v-if="typeof lyrics=='object'" v-for="(item,index) in lyrics" :key="index"
             :class="{ active: lyricIndex === index}">
          <p>{{ item.text }}</p>
        </div>
        <div class="lyrics CYY" v-else>
          <p>纯音乐，请您欣赏</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {musicLyric} from "../../../network/Top";

  export default {
    name: "RLyric",
    data() {
      return {
        lyrics: [],
        lyricIndex: 0,
        top: 0
      }
    },
    props: {
      songId: {
        type: Number,
        default: 0
      },
      cTime: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.songId = this.$store.state.songId
      this.requestLyric(this.songId)
    },
    mounted() {
      let audio = document.getElementById("audio");
      let topLyric = this.$refs.topLyric;
      topLyric.innerText = '加载中';
      window.addEventListener('resize', () => {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => this.calcTop(), 60)
      });
      this.calcTop();
      let lyric = '';
      audio.addEventListener('timeupdate', () => {
        let lyricIndex = 0;
        for (let i = 0; i < this.lyrics.length; i++) {
          if (audio.currentTime >= this.lyrics[i].time) {
            lyricIndex = i
          }
        }
        this.lyricIndex = lyricIndex;
        if (this.lyrics.length !== 0 && Array.isArray(this.lyrics) && this.lyrics[this.lyricIndex] && this.lyrics[this.lyricIndex].hasOwnProperty('text')) {
          lyric = this.lyrics[this.lyricIndex].text
        }
        topLyric.innerText = lyric
      })
    },
    computed: {
      lyricTop() {
        return `transform :translate3d(0, ${-41 *
        (this.lyricIndex - this.top)}px, 0)`
      },
    },
    watch: {
      songId(newValue) {
        this.requestLyric(newValue);
      }
    },
    methods: {
      requestLyric(sid) {
        musicLyric(sid).then(res => {
          if (res.data.nolyric || res.data.nocollected) {
            this.lyrics = '暂无歌词'
          } else {
            let lyric = res.data.lrc.lyric
            if (lyric.length > 0 || res.data.nolyric) {
              this.lyrics = this.parseLyric(lyric)
              if (this.lyrics.length === 0) {
                this.lyrics = lyric
              }
            }
          }
        })
      },
      parseLyric(lrc) {
        let lyrics = lrc.split("\n");
        let lrcObj = [];
        for (let i = 0; i < lyrics.length; i++) {
          let lyric = decodeURIComponent(lyrics[i]);
          let timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
          let timeRegExpArr = lyric.match(timeReg);
          if (!timeRegExpArr) continue;
          let clause = lyric.replace(timeReg, '');
          for (let k = 0, h = timeRegExpArr.length; k < h; k++) {
            let t = timeRegExpArr[k];
            let min = Number(String(t.match(/\[\d*/i)).slice(1)),
                sec = Number(String(t.match(/\:\d*/i)).slice(1));
            let time = min * 60 + sec;
            if (clause !== '') {
              lrcObj.push({time: time, text: clause})
            }
          }
        }
        return lrcObj
      },
      calcTop() {
        const dom = this.$refs.musicLyric
        const {display = ''} = window.getComputedStyle(dom)
        if (display === 'none') {
          return
        }
        const height = dom.offsetHeight
        this.top = Math.floor(height / 40 / 2)
      },
    }
  }
</script>

<style scoped>
  .rightL {
    height: 240px;
    margin: 10px 0;
    overflow: hidden;
  }

  .topLyric {
    display: none;
  }

  .lyrics {
    white-space: pre-line;
    text-align: center;
    font-size: 16px;
    line-height: 25px;
    transform: translate3d(0, 0, 0);
    transition: transform 0.6s ease-out;
  }

  .active p, .CYY {
    color: transparent;
    background: linear-gradient(to right, #00aaff, greenyellow);
    -webkit-background-clip: text;
    font-weight: bolder;
  }

  @media screen and (max-width: 768px) {
    .rightL {
      display: none;
    }

    .topLyric {
      width: 90%;
      overflow: hidden;
      display: inline;
      position: absolute;
      /*top: 2%;*/
      left: 5%;
      text-align: center;
      margin: 0 auto;
      /*color: #03A9F4;*/
      /*font-size: 26px;*/
      z-index: 3;
      /*font-family: STXingkai;*/

      color: #fa6666;
      top: 30%;
      font-size: 16px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>

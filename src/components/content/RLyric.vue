<template>
  <div>
    <div class="topLyric active" v-show="showTop">{{ activeLyric }}</div>
    <div class="rightL" ref="musicLyric" v-show="!showTop">
      <div :style="lyricTop">
        <div class="lyrics" v-for="(item, index) in lyrics" :key="index">
          <div
            class="lyric"
            :class="{ active: lyricIndex === index || lyrics.length === 1 }"
          >
            {{ item.text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { musicLyric } from "@/network/Request";
import { parseLyric } from "@/features";

export default {
  name: "RLyric",
  data() {
    return {
      lyrics: [],
      lyricsMap: new Map(),
      lyricsTime: new Map(),
      lyricIndex: 0,
      activeLyric: "暂无歌词",
      top: 0,
      showTop: false,
    };
  },
  props: {
    songId: {
      type: Number,
      default: 0,
    },
    cTime: {
      type: Number,
      default: 0,
    },
  },
  created() {
    this.songId = this.$store.state.songId;
    this.requestLyric(this.songId);
    this.showTop = document.documentElement.offsetWidth <= 768;
  },
  mounted() {
    let audio = document.getElementById("audio");

    window.addEventListener("resize", () => {
      clearTimeout(this.resizeTimer);
      this.showTop = document.documentElement.offsetWidth <= 768;
      !this.showTop &&
        (this.resizeTimer = setTimeout(() => this.calcTop(), 60));
    });

    !this.showTop && this.$nextTick(() => this.calcTop());
    audio.addEventListener("timeupdate", () => {
      let curTime = Math.floor(audio.currentTime);

      // 使用 map 代替之前的 for 循环比较，避免不必要的性能消耗
      if (this.lyricsMap.has(curTime)) {
        this.activeLyric = this.lyricsMap.get(curTime);
      }
      if (this.lyricsTime.has(curTime)) {
        this.lyricIndex = this.lyricsTime.get(curTime);
      }
    });
    audio.addEventListener("ended", () => {
      this.lyricIndex = 0;
      this.activeLyric = this.lyrics[0];
    });
  },
  computed: {
    lyricTop() {
      const line = document.getElementsByClassName("lyric")[0];
      const lineH = (line && line.getBoundingClientRect().height) || 25;
      return `transform :translate3d(0, ${-lineH *
        (this.lyricIndex - this.top)}px, 0)`;
    },
  },
  watch: {
    songId(newValue) {
      this.lyrics = [];
      this.activeLyric = "暂无歌词";
      this.lyricIndex = 0;
      this.lyricsMap = new Map();
      this.lyricsTime = new Map();
      this.requestLyric(newValue);
    },
  },
  methods: {
    async requestLyric(sid) {
      let res = await musicLyric(sid);
      if (res.data.nolyric || res.data.nocollected) {
        this.lyrics = [{ text: "暂无歌词" }];
      } else {
        let lyric = res.data.lrc.lyric;
        if (lyric.length > 0 || res.data.nolyric) {
          let tempLyric = parseLyric(lyric);
          this.lyrics = tempLyric[0];
          this.lyricsMap = tempLyric[1];
          this.lyricsTime = tempLyric[2];
        }
      }
    },
    calcTop() {
      const dom = this.$refs.musicLyric;
      const line = document.getElementsByClassName("lyric")[0];
      const { display = "" } = window.getComputedStyle(dom);
      if (display === "none") {
        return;
      }
      const height = dom.offsetHeight;
      const lineH = (line && line.getBoundingClientRect().height) || 25;
      this.top = Math.floor(height / lineH / 2);
    },
  },
};
</script>

<style scoped>
.rightL {
  height: 32vh;
  margin: 10px 0;
  overflow: hidden;
}

.lyrics {
  white-space: pre-line;
  text-align: center;
  font-size: 16px;
  line-height: 25px;
  transform: translate3d(0, 0, 0);
  transition: transform 0.6s ease-out;
}

.active {
  color: transparent;
  background: linear-gradient(to right, #0af, #2fff39);
  -webkit-background-clip: text;
  font-size: calc(12px + 1vmin);
  font-weight: 700;
}

@media screen and (max-width: 768px) {
  .topLyric {
    width: 90%;
    left: 5%;
    top: 40%;
    overflow: hidden;
    display: inline-block;
    position: absolute;
    text-align: center;
    margin: 0 auto;
    z-index: 3;
    font-size: 16px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>

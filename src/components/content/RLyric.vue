<template>
  <div>
    <vertical-scroll class="rightL" ref="musicLyric" :probe-type="3">
      <div>
        <div class="lyrics" v-for="(item, index) in lyrics" :key="index">
          <div
            class="lyric"
            :class="{ active: lyricIndex === index || lyrics.length === 1 }"
          >
            {{ item.text }}
          </div>
          <div class="lyric" :class="{ active: lyricIndex === index }">
            {{ item.ttext }}
          </div>
        </div>
      </div>
    </vertical-scroll>
  </div>
</template>

<script>
import VerticalScroll from "@/components/common/scroll/VerticalScroll";

import req from "@/network/req";
import { parseLyric, parseLyricByQq } from "@/features";
import { mapState } from "vuex";

export default {
  name: "RLyric",
  components: { VerticalScroll },
  data() {
    return {
      lyrics: [{ time: 0, text: "暂无歌词" }],
      lyricsMap: new Map(),
      tlyricsMap: new Map(),
      lyricsTime: new Map(),
      lyricIndex: 0,
      activeLyric: "暂无歌词",
      top: 0,
      lineH: 30,
      resizeTimer: null,
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
  },
  mounted() {
    let audio = document.getElementById("audio");
    let line = document.getElementsByClassName("lyrics")[0];

    window.addEventListener("resize", () => {
      this.$nextTick(() => this.calcTop());
    });

    audio.addEventListener("timeupdate", () => {
      this.refresh();
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
      this.activeLyric = this.lyrics[0].text;
    });
  },
  computed: {
    ...mapState(["source"]),
    lyricTop() {
      return `transform :translate3d(0, ${
        -lineH * (this.lyricIndex - this.top)
      }px, 0)`;
    },
  },
  watch: {
    songId(newValue) {
      this.lyrics = [{ time: 0, text: "暂无歌词" }];
      this.activeLyric = "暂无歌词";
      this.lyricIndex = 0;
      this.lyricsMap = new Map();
      this.lyricsTime = new Map();
      this.requestLyric(newValue);
      this.$refs.musicLyric.scrollTo(0, 0, 1000);
    },
    lyricIndex(newValue) {
      this.lineH = document
        .getElementsByClassName("lyrics")
        [newValue].getBoundingClientRect().height;
      this.calcTop();
      if (newValue > this.top && newValue < this.lyrics.length - this.top) {
        let y = (newValue - this.top) * this.lineH;
        this.$refs.musicLyric.scrollTo(0, -y, 1000);
      }
    },
  },
  methods: {
    async requestLyric(sid) {
      if (this.source === "netease") {
        let data = await req.netease.musicLyric(sid);
        if (!data || data.nolyric || data.nocollected || !data.lrc) {
          this.lyrics = [{ text: "暂无歌词" }];
        } else {
          let lrc = data.lrc.lyric;
          if (lrc) {
            let tempLyric = parseLyric(data);
            this.updateLyric(tempLyric);
          }
        }
      } else if (this.source === "qq") {
        let data = await req.qq.getMusicLyricByQq(sid);
        if (data && data.lyric) {
          let tempLyric = parseLyricByQq(data);
          this.updateLyric(tempLyric);
        } else {
          this.lyrics = [{ text: "暂无歌词" }];
        }
      }
    },
    updateLyric(tempLyric) {
      this.lyrics = tempLyric[0];
      this.lyricsMap = tempLyric[1];
      this.tlyricsMap = tempLyric[2];
      this.lyricsTime = tempLyric[3];
      for (let v of this.lyrics) {
        if (this.tlyricsMap.has(v.time)) {
          v.ttext = this.tlyricsMap.get(v.time);
        }
      }
    },
    calcTop() {
      let style = document.documentElement.getBoundingClientRect();
      let height = style.width >= 768 ? style.height * 0.5 : style.height * 0.4;

      this.top = Math.floor(height / this.lineH / 2);
    },
    refresh() {
      this.$refs.musicLyric &&
        this.$refs.musicLyric.scroll &&
        this.$refs.musicLyric.scroll.refresh &&
        this.$refs.musicLyric.scroll.refresh();
    },
  },
};
</script>

<style scoped>
.rightL {
  width: 85%;
  height: 50vh;
  overflow: hidden;
}

.lyrics {
  white-space: pre-line;
  text-align: center;
  font-size: 16px;
  line-height: 30px;
  transform: translate3d(0, 0, 0);
  transition: transform 0.6s ease-out;
}

.lyric {
  width: 96%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.active {
  opacity: 1;
  color: transparent;
  background: linear-gradient(to right, #0af, #2fff39);
  background-clip: text;
  font-size: calc(12px + 1vmin);
  font-weight: 700;
}

@media screen and (max-width: 768px) {
  .rightL {
    height: 40vh;
  }
}
</style>

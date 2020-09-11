<template>
  <div id="play" :style="backImage">
    <div class="left">
      <img :src="imgs" alt="网易云音乐" />
      <div class="song_singer">
        <div class="name">
          <el-tooltip content="歌曲名" placement="top">
            <span>{{ name }}</span>
          </el-tooltip>
          <div>||</div>
        </div>
        <div class="name">
          <el-tooltip content="点击查看歌手详情" placement="bottom">
            <span @click="searchPlayer()">
              {{ player }}
            </span>
          </el-tooltip>
        </div>
      </div>
    </div>
    <audio
      id="audio"
      ref="audio"
      :src="urls"
      autoplay
      muted
      crossorigin="anonymous"
    />
    <video
      ref="video"
      autoplay
      muted
      crossorigin="anonymous"
      :src="videos"
      v-if="hasMv && isPc"
    />
    <!--    <canvas id="canvas"></canvas>-->
    <div class="rightS">
      <div class="song_name">{{ name }}</div>
      <div>|</div>
      <div class="singer">
        <el-tooltip content="点击查看歌手详情" placement="right">
          <span @click="searchPlayer()">
            {{ player }}
          </span>
        </el-tooltip>
      </div>
    </div>
    <r-lyric class="right" :songId="id" :cTime="cTime" />
    <div class="playControl">
      <div class="control">
        <el-tooltip content="随机播放" placement="bottom">
          <i
            class="fa fa-random fa-2x"
            aria-hidden="true"
            v-if="random"
            @click="changeList"
          ></i>
        </el-tooltip>
        <el-tooltip content="顺序播放" placement="bottom">
          <i
            class="fa fa-bars fa-2x"
            aria-hidden="true"
            v-if="order"
            @click="changeList"
          ></i>
        </el-tooltip>
        <el-tooltip content="上一曲" placement="top">
          <i
            class="fa fa-step-backward fa-2x"
            aria-hidden="true"
            @click="prev"
          ></i>
        </el-tooltip>
        <el-tooltip content="继续播放" placement="bottom">
          <i
            class="fa fa-play fa-2x"
            aria-hidden="true"
            v-if="!status"
            @click="play"
          ></i>
        </el-tooltip>
        <el-tooltip content="暂停播放" placement="bottom">
          <i
            class="fa fa-pause fa-2x"
            aria-hidden="true"
            @click="play"
            v-if="status"
          ></i>
        </el-tooltip>
        <el-tooltip content="下一曲" placement="top">
          <i
            class="fa fa-step-forward fa-2x"
            aria-hidden="true"
            @click="next"
          ></i>
        </el-tooltip>
        <el-tooltip content="查看热评" placement="bottom">
          <i
            class="fa fa-commenting fa-2x"
            aria-hidden="true"
            @click="enjoyComment"
          ></i>
        </el-tooltip>
        <el-tooltip content="下载" placement="top">
          <i
            class="fa fa-download fa-2x"
            aria-hidden="true"
            @click="downloadMusic"
          ></i>
        </el-tooltip>
      </div>
      <div class="timeProgress">
        <el-tooltip content="当前播放时间" placement="bottom">
          <div class="leftTime">{{ this.cTime | timeFormat }}</div>
        </el-tooltip>
        <div class="myProgress" @click="offsetX">
          <hr id="ori" ref="ori" />
          <hr id="cPro" :style="csty" />
        </div>
        <el-tooltip content="歌曲时长" placement="top">
          <div class="rightTime">{{ this.currDuration | timeFormat }}</div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import {
  checkMusic,
  download,
  musicCover,
  musicUrl,
  search,
  getMv,
} from "@/network/Request";
import RLyric from "@/components/content/RLyric";
import { shuffle } from "../utils";

export default {
  name: "Play",
  components: { RLyric },
  data() {
    return {
      name: "",
      player: "",
      imgs: "",
      videos: "",
      urls: "",
      randomListIds: [],
      currentIndex: 0,
      currDuration: 0,
      order: true,
      random: false,
      cTime: 0,
      percent: 0,
      oWidth: 0,
      status: false,
      hasMv: false,
      isPc: false,
    };
  },
  created() {
    this.id = this.$store.state.songId;
    this.requestCover(this.id);
    musicUrl(this.id).then((res) => {
      this.urls = res.data.data[0].url;
    });
  },
  mounted() {
    let audio = this.$refs.audio;
    let ori = this.$refs.ori;

    this.oWidth = ori.clientWidth;
    this.currDuration = parseInt(audio.duration) ? parseInt(audio.duration) : 0;

    this.isPc = document.documentElement.clientWidth >= 1000;

    window.addEventListener("resize", () => {
      this.oWidth = ori.clientWidth;
      this.isPc = document.documentElement.clientWidth >= 1000;
    });
    audio.addEventListener("play", () => {
      this.status = true;
      this.currDuration = parseInt(audio.duration);
      // this.onLoadAudio();
    });
    audio.addEventListener("pause", () => {
      this.status = false;
    });
    audio.addEventListener("timeupdate", () => {
      this.currDuration = parseInt(audio.duration);
      this.cTime = parseInt(audio.currentTime);
      this.percent = (this.cTime / audio.duration).toFixed(2);
    });
    audio.addEventListener("ended", () => {
      this.cTime = 0;
      this.percent = 0;
      this.currDuration = 0;
      this.currentIndex++;
    });
    audio.addEventListener("error", () => {
      console.log("error");
      this.showAlert();
    });
  },
  computed: {
    backImage() {
      return {
        backgroundImage: "url(" + this.imgs + ")",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        zIndex: "-2",
      };
    },
    csty() {
      return `width: ${this.percent * this.oWidth}px`;
    },
    id: {
      get() {
        return this.$store.state.songId;
      },
      set(val) {
        this.$store.commit("updateSongId", val);
      },
    },
    playlistIds: {
      get() {
        return this.$store.state.playlistIds;
      },
      set(val) {
        this.$store.commit("updatePlaylistIds", val);
      },
    },
  },
  watch: {
    name(newValue) {
      search(newValue + " " + this.player, 1004).then((res) => {
        let {
          data: { result },
        } = res;
        this.hasMv =
          Object.keys(result).length !== 0 && result.mvs.length !== 0;
        if (this.hasMv) {
          let mvid = result.mvs[0].id;
          mvid &&
            getMv(mvid).then((res) => {
              this.videos = res.data.data.url;
            });
        }
      });
    },
    status(newValue) {
      let video = this.$refs.video;
      if (newValue) {
        this.videos && video.play();
      } else {
        this.videos && video.pause();
      }
    },
    id(newValue) {
      if (newValue) {
        this.id = newValue;
        this.playlistIds = this.order ? this.playlistIds : this.randomListIds;
        this.$store.commit("updateSongId", newValue);
        musicUrl(newValue).then((res) => {
          this.urls = res.data.data[0].url;
          if (!this.urls) {
            this.showAlert();
          } else {
            this.requestCover(newValue);
            this.play();
          }
        });
      } else {
        this.showAlert();
      }
    },
    currentIndex() {
      this.id = this.playlistIds[this.currentIndex];
    },
    order() {
      if (this.order) {
        this.playlistIds = this.$store.state.playlistIds;
      } else {
        this.doRandom();
      }
    },
    random() {
      if (this.random) {
        this.doRandom();
      } else {
        this.playlistIds = this.$store.state.playlistIds;
      }
    },
  },
  methods: {
    requestCover(newValue) {
      musicCover(newValue).then((res) => {
        if (res.data.code === 200) {
          let database = res.data.songs[0];
          this.imgs = database.al.picUrl;
          this.$store.state.imgUrl = this.imgs;
          this.name = database.name;
          this.player = database.ar[0].name;
        }
      });
    },
    doRandom() {
      this.randomListIds = [...this.playlistIds];
      this.playlistIds = shuffle(this.randomListIds);
    },
    jumpIndex() {
      if (this.id !== this.playlistIds[this.currentIndex]) {
        this.currentIndex = this.playlistIds.findIndex((id) => {
          return id === this.id;
        });
      }
    },
    play() {
      this.status = true;
      let audio = this.$refs.audio;
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
      this.$store.commit("updateSingerName", this.player);
    },
    prev() {
      this.status = false;
      if (this.playlistIds.length === 1) {
        this.currentIndex = 0;
        return;
      }
      this.jumpIndex();
      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.playlistIds.length - 1;
      }
    },
    next() {
      this.jumpIndex();
      this.currentIndex++;
      if (this.currentIndex >= this.playlistIds.length) {
        this.currentIndex = 0;
      }
    },
    changeList() {
      this.random = !this.random;
      this.order = !this.order;
    },
    searchPlayer() {
      this.$store.commit("updateSingerName", this.player);
      this.$router.push("/singer");
    },
    offsetX(event) {
      const audio = this.$refs.audio;
      const video = this.$refs.video;

      this.percent = (event.offsetX / this.oWidth).toFixed(2);
      this.cTime = parseInt(this.percent * this.currDuration);

      audio.currentTime = this.cTime;
      audio.play();
      if (this.hasMv) {
        video.currentTime = this.cTime;
        video.play();
      }
    },
    enjoyComment() {
      this.$router.push("/comment");
    },
    downloadMusic() {
      //	Phone
      // let name = this.name + '-' + this.player + '.mp3';
      // let dtask = plus.downloader.createDownload(this.urls, {
      //   method: 'post',
      //   filename: `_downloads/${this.name}`,
      //   retry: 3
      // }, function(d, status){
      //   if(status === 200){
      //     alert("下载成功: " + d.filename);
      //     // _this.showPluginAuto();
      //     plus.runtime.openFile(d.filename);
      //   } else {
      //     alert("下载失败: " + status);
      //   }
      // });
      // //dtask.addEventListener("statechanged", onStateChanged, false);
      // dtask.start();

      //	PC
      download(this.urls).then((res) => {
        let blob = new Blob([res.data], { type: "audio/mpeg;charset=utf-8" });
        let downloadElement = document.createElement("a");
        let href = window.URL.createObjectURL(blob);

        downloadElement.href = href;
        downloadElement.download = this.name + "-" + this.player + ".mp3";

        document.body.appendChild(downloadElement);
        downloadElement.click();

        document.body.removeChild(downloadElement);
        window.URL.revokeObjectURL(href);
      });
    },
    showAlert() {
      // this.$message.error({
      //   showClose: true,
      //   message: "好像出错误了！尝试自动切换到下一首！",
      // });
      this.$notify({
        title: "错误",
        message: "好像出错误了！尝试自动切换到下一首 ~",
        type: "error",
      });
      this.next();
    },
    // onLoadAudio() {
    //   let context = new (window.AudioContext || window.webkitAudioContext)();
    //   let analyser = context.createAnalyser();
    //   analyser.fftSize = 512;
    //   let source = context.createMediaElementSource(audio);
    //
    //   source.connect(analyser);
    //   analyser.connect(context.destination);
    //
    //   let bufferLength = analyser.frequencyBinCount;
    //   let dataArray = new Uint8Array(bufferLength);
    //
    //   let canvas = document.getElementById("canvas");
    //   canvas.width = window.innerWidth;
    //   canvas.height = window.innerHeight;
    //
    //   let ctx = canvas.getContext("2d");
    //   let WIDTH = canvas.width;
    //   let HEIGHT = canvas.height;
    //
    //   let barWidth = (WIDTH / bufferLength) * 1.5;
    //   let barHeight;
    //
    //   function renderFrame() {
    //     requestAnimationFrame(renderFrame);
    //
    //     analyser.getByteFrequencyData(dataArray);
    //
    //     ctx.clearRect(0, 0, WIDTH, HEIGHT);
    //
    //     for (let i = 0, x = 0; i < bufferLength; i++) {
    //       barHeight = dataArray[i];
    //
    //       let r = barHeight + 25 * (i / bufferLength);
    //       // let r = Math.round(Math.random()*255);
    //
    //       let g = 250 * (i / bufferLength);
    //       // let g = Math.round(Math.random()*255);
    //
    //       let b = 50;
    //       // let b = Math.round(Math.random()*255);
    //
    //       ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    //       ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
    //
    //       x += barWidth + 2;
    //     }
    //   }
    //
    //   renderFrame();
    //   // setInterval(renderFrame, 44);
    // }
  },
};
</script>

<style scoped>
video {
  width: 100vw;
  height: 34vh;
  object-fit: cover;
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0.85;
}

#canvas {
  position: absolute;
  left: 5%;
  bottom: 80px;
  width: 90%;
  height: 200%;
  opacity: 0.75;
}

img {
  width: 200px;
  height: 200px;
}

#play {
  width: 100%;
  height: 34vh;
  display: flex;
}

.left,
.right,
.rightS {
  background: rgba(0, 0, 0, 0.5);
  flex: 1;
}

.left {
  display: flex;
  justify-content: center;
  align-items: center;
}

.left img {
  opacity: 0.7;
  border-radius: 50%;
  animation: imgRotate 6s linear infinite normal;
  position: relative;
  z-index: 2;
  margin-top: 2vh;
}

.song_singer {
  z-index: 6;
}

.name,
.song_name,
.singer {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.name {
  max-width: 30vw;
  color: #f6506e;
  font-size: 20px;
  font-family: "Times New Roman", Times, serif;
  font-weight: 800;
}

.rightS div {
  max-width: 90vw;
}

@keyframes imgRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.right {
  flex: 1;
}

.rightS {
  display: none;
}

a:hover {
  cursor: pointer;
}

i {
  color: #6cc1b9;
  margin: 10px 18px;
}

.fa-2x {
  font-size: 1.5em;
}

.playControl {
  width: 96%;
  margin: 0 2vw;
  padding: 10px;
  position: absolute;
  bottom: 10px;
  display: flex;
  justify-content: center;
  background-color: #efeaea85;
  border-radius: 10px;
  transition: all 0.5s;
  z-index: 9;
}

.timeProgress {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
}

.leftTime,
.rightTime {
  flex: 1;
  color: #ebebeb;
}

.myProgress {
  flex: 6;
  margin: 0 1vw;
}

.myProgress:hover {
  cursor: pointer;
}

hr {
  height: 5px;
  background-color: #e3dddd;
  border: none;
  border-radius: 20px;
  margin: 0;
}

#ori {
  position: relative;
  z-index: 1;
}

#cPro {
  color: transparent;
  background: linear-gradient(to right, #00aaff, greenyellow);
  position: absolute;
  z-index: 2;
  margin-top: -5px;
}

@media screen and (max-width: 768px) {
  .fa-2x {
    font-size: 1.3em;
    margin: 5px 2.5vh;
  }

  video {
    height: 20vh;
  }

  #play {
    height: 20vh;
  }

  .left {
    display: none;
  }

  .right {
    flex: 0;
  }

  .rightS {
    display: inline-block;
    color: #f25e0c;
    padding: 10px;
    z-index: 1;
  }

  .playControl {
    width: 96vw;
    margin: 0 2vw;
    float: left;
    flex-wrap: wrap;
    padding: 5px;
  }

  .control {
    width: 100vw;
  }

  #canvas {
    width: 100%;
    height: 35vh;
    position: fixed;
    left: 0;
    top: 0;
  }
}
</style>
